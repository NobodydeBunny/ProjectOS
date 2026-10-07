import { z } from "zod";
import { q, run, newId, now } from "./client";

const Text = z.string().trim().min(1).max(2000);
const SnapshotInput = z.object({
  summary: z.string().trim().max(4000).default(""),      // "What did you do?"
  resumeAction: z.string().trim().max(1000).default(""), // "What should you do on return?"
  notes: z.string().trim().max(4000).default(""),
});

export interface Session {
  id: string; project_id: string; started_at: string; ended_at: string | null;
  duration_seconds: number | null; notes: string;
}
export interface Snapshot {
  id: string; project_id: string; session_id: string | null; created_at: string;
  milestone_title: string | null; action_title: string | null;
  summary: string; resume_action: string; notes: string;
}
export interface Idea {
  id: string; project_id: string; session_id: string | null; text: string;
  status: "new" | "planned" | "done" | "dismissed"; created_at: string;
}
export interface Decision { id: string; project_id: string; session_id: string | null; text: string; created_at: string }
export interface Blocker { id: string; project_id: string; session_id: string | null; text: string; created_at: string; resolved_at: string | null }

// ---------- sessions ----------
export async function getOpenSession(projectId: string): Promise<Session | null> {
  return (await q<Session>("SELECT * FROM sessions WHERE project_id = $1 AND ended_at IS NULL", [projectId]))[0] ?? null;
}

export async function startSession(projectId: string): Promise<Session> {
  const open = await getOpenSession(projectId);
  if (open) return open;
  const id = newId();
  await run("INSERT INTO sessions (id, project_id, started_at) VALUES ($1, $2, $3)", [id, projectId, now()]);
  return (await q<Session>("SELECT * FROM sessions WHERE id = $1", [id]))[0];
}

/** Ends the open session (if any), records its length, and stamps the project's last_worked_at. */
export async function closeOpenSession(projectId: string, notes = ""): Promise<Session | null> {
  const open = await getOpenSession(projectId);
  if (!open) return null;
  const end = now();
  const secs = Math.max(0, Math.round((Date.parse(end) - Date.parse(open.started_at)) / 1000));
  await run("UPDATE sessions SET ended_at = $1, duration_seconds = $2, notes = $3 WHERE id = $4", [end, secs, notes, open.id]);
  await run("UPDATE projects SET last_worked_at = $1, updated_at = $1 WHERE id = $2", [end, projectId]);
  return (await q<Session>("SELECT * FROM sessions WHERE id = $1", [open.id]))[0];
}

export const listSessions = (projectId: string) =>
  q<Session>("SELECT * FROM sessions WHERE project_id = $1 ORDER BY started_at DESC", [projectId]);

// ---------- ideas / decisions / blockers: auto-attached to the open session ----------
// Placeholders must first appear in order ($1, $2, ...) so positional binding is unambiguous.
const OPEN = "(SELECT id FROM sessions WHERE project_id = $2 AND ended_at IS NULL)";

export async function captureIdea(projectId: string, text: string): Promise<void> {
  await run(`INSERT INTO ideas (id, project_id, session_id, text, created_at) VALUES ($1, $2, ${OPEN}, $3, $4)`,
    [newId(), projectId, Text.parse(text), now()]);
}
export const listIdeas = (projectId: string) =>
  q<Idea>("SELECT * FROM ideas WHERE project_id = $1 ORDER BY created_at DESC", [projectId]);
export const setIdeaStatus = (id: string, status: Idea["status"]) =>
  run("UPDATE ideas SET status = $1 WHERE id = $2", [status, id]);

export async function addDecision(projectId: string, text: string): Promise<void> {
  await run(`INSERT INTO decisions (id, project_id, session_id, text, created_at) VALUES ($1, $2, ${OPEN}, $3, $4)`,
    [newId(), projectId, Text.parse(text), now()]);
}
export const listDecisions = (projectId: string) =>
  q<Decision>("SELECT * FROM decisions WHERE project_id = $1 ORDER BY created_at DESC", [projectId]);

export async function addBlocker(projectId: string, text: string): Promise<void> {
  await run(`INSERT INTO blockers (id, project_id, session_id, text, created_at) VALUES ($1, $2, ${OPEN}, $3, $4)`,
    [newId(), projectId, Text.parse(text), now()]);
}
export const resolveBlocker = (id: string) => run("UPDATE blockers SET resolved_at = $1 WHERE id = $2", [now(), id]);
export const listOpenBlockers = (projectId: string) =>
  q<Blocker>("SELECT * FROM blockers WHERE project_id = $1 AND resolved_at IS NULL ORDER BY created_at", [projectId]);

// ---------- snapshots ----------
/** Freezes the current milestone/action titles plus the user's quick answers. */
export async function createSnapshot(projectId: string, input: unknown): Promise<Snapshot> {
  const d = SnapshotInput.parse(input);
  const [ctx] = await q<{ m: string | null; a: string | null; s: string | null }>(
    `SELECT (SELECT title FROM milestones WHERE project_id = $1 AND status = 'current') AS m,
            (SELECT title FROM actions WHERE project_id = $1 AND status = 'current') AS a,
            (SELECT id FROM sessions WHERE project_id = $1 ORDER BY (ended_at IS NULL) DESC, started_at DESC LIMIT 1) AS s`,
    [projectId]
  );
  const id = newId();
  await run(
    `INSERT INTO snapshots (id, project_id, session_id, created_at, milestone_title, action_title, summary, resume_action, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, projectId, ctx.s, now(), ctx.m, ctx.a, d.summary, d.resumeAction || ctx.a || "", d.notes]
  );
  return (await q<Snapshot>("SELECT * FROM snapshots WHERE id = $1", [id]))[0];
}

export async function getLatestSnapshot(projectId: string): Promise<Snapshot | null> {
  return (await q<Snapshot>("SELECT * FROM snapshots WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1", [projectId]))[0] ?? null;
}