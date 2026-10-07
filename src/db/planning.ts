import { z } from "zod";
import { q, run, newId, now } from "./client";

const Text = z.string().trim().min(1).max(2000);

export interface Milestone {
  id: string; project_id: string; title: string; description: string; position: number;
  status: "upcoming" | "current" | "done"; created_at: string; completed_at: string | null;
}
export interface Action {
  id: string; project_id: string; milestone_id: string | null; title: string;
  status: "current" | "done" | "skipped"; created_at: string; completed_at: string | null;
  completed_in_session_id: string | null;
}
export interface DodItem {
  id: string; project_id: string; title: string; position: number; done: 0 | 1; completed_at: string | null;
}

// ---------- milestones ----------
export async function addMilestone(projectId: string, title: string): Promise<void> {
  const t = Text.parse(title);
  const [row] = await q<{ next: number; has_current: number }>(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next,
            COALESCE(SUM(status = 'current'), 0) AS has_current
     FROM milestones WHERE project_id = $1`,
    [projectId]
  );
  await run(
    `INSERT INTO milestones (id, project_id, title, position, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [newId(), projectId, t, row.next, row.has_current ? "upcoming" : "current", now()]
  );
}

export const listMilestones = (projectId: string) =>
  q<Milestone>("SELECT * FROM milestones WHERE project_id = $1 ORDER BY position", [projectId]);

export async function setCurrentMilestone(projectId: string, milestoneId: string): Promise<void> {
  await run("UPDATE milestones SET status = 'upcoming' WHERE project_id = $1 AND status = 'current'", [projectId]);
  await run("UPDATE milestones SET status = 'current' WHERE id = $1 AND project_id = $2 AND status != 'done'", [milestoneId, projectId]);
}

export const completeMilestone = (id: string) =>
  run("UPDATE milestones SET status = 'done', completed_at = $1 WHERE id = $2", [now(), id]);

// ---------- actions ----------
export async function setCurrentAction(projectId: string, title: string): Promise<void> {
  const t = Text.parse(title); // validate FIRST, so we never skip the old action and then fail
  await run("UPDATE actions SET status = 'skipped' WHERE project_id = $1 AND status = 'current'", [projectId]);
  await run(
    `INSERT INTO actions (id, project_id, milestone_id, title, created_at)
     VALUES ($1, $2, (SELECT id FROM milestones WHERE project_id = $2 AND status = 'current'), $3, $4)`,
    [newId(), projectId, t, now()]
  );
}

export async function getCurrentAction(projectId: string): Promise<Action | null> {
  return (await q<Action>("SELECT * FROM actions WHERE project_id = $1 AND status = 'current'", [projectId]))[0] ?? null;
}

export const completeAction = (projectId: string) =>
  run(
    `UPDATE actions SET status = 'done', completed_at = $1,
       completed_in_session_id = (SELECT id FROM sessions WHERE project_id = $2 AND ended_at IS NULL)
     WHERE project_id = $2 AND status = 'current'`,
    [now(), projectId]
  );

export const listActions = (projectId: string) =>
  q<Action>("SELECT * FROM actions WHERE project_id = $1 ORDER BY created_at", [projectId]);

// ---------- definition of done + progress ----------
export async function addDodItem(projectId: string, title: string): Promise<void> {
  const t = Text.parse(title);
  const [row] = await q<{ next: number }>(
    "SELECT COALESCE(MAX(position), -1) + 1 AS next FROM dod_items WHERE project_id = $1", [projectId]);
  await run("INSERT INTO dod_items (id, project_id, title, position) VALUES ($1, $2, $3, $4)",
    [newId(), projectId, t, row.next]);
}

export const listDodItems = (projectId: string) =>
  q<DodItem>("SELECT * FROM dod_items WHERE project_id = $1 ORDER BY position", [projectId]);

export const toggleDodItem = (id: string) =>
  run("UPDATE dod_items SET done = 1 - done, completed_at = CASE WHEN done = 0 THEN $1 ELSE NULL END WHERE id = $2",
    [now(), id]);

/** Progress = Definition-of-Done items if any exist, otherwise milestones, otherwise unknown. */
export async function getProgress(projectId: string) {
  const [d] = await q<{ total: number; done: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(done), 0) AS done FROM dod_items WHERE project_id = $1", [projectId]);
  if (d.total > 0) return { basis: "dod" as const, done: d.done, total: d.total, pct: Math.round((d.done / d.total) * 100) };
  const [m] = await q<{ total: number; done: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(status = 'done'), 0) AS done FROM milestones WHERE project_id = $1", [projectId]);
  if (m.total > 0) return { basis: "milestones" as const, done: m.done, total: m.total, pct: Math.round((m.done / m.total) * 100) };
  return { basis: "none" as const, done: 0, total: 0, pct: null };
}