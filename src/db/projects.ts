import { z } from "zod";
import { q, run, newId, now, DomainError } from "./client";
import { closeOpenSession } from "./sessions";

export type ProjectStatus = "active" | "backlog" | "parked" | "completed";

export interface Project {
  id: string; name: string; description: string; goal: string;
  status: ProjectStatus; priority: number;
  park_reason: string | null; resume_condition: string | null;
  created_at: string; updated_at: string;
  last_worked_at: string | null; completed_at: string | null;
}

// Zod checks input BEFORE it touches the database
const CreateProjectInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).default(""),
  goal: z.string().trim().max(2000).default(""),
  priority: z.number().int().min(1).max(3).default(2),
});

export async function createProject(input: unknown): Promise<Project> {
  const d = CreateProjectInput.parse(input);
  const id = newId();
  const t = now();
  await run(
    `INSERT INTO projects (id, name, description, goal, priority, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, d.name, d.description, d.goal, d.priority, t, t]
  );
  return (await getProject(id))!;
}

export async function getProject(id: string): Promise<Project | null> {
  return (await q<Project>("SELECT * FROM projects WHERE id = $1", [id]))[0] ?? null;
}

export const listProjects = (status?: ProjectStatus) =>
  status
    ? q<Project>("SELECT * FROM projects WHERE status = $1 ORDER BY created_at", [status])
    : q<Project>("SELECT * FROM projects ORDER BY created_at");

export async function getActiveProject(): Promise<Project | null> {
  return (await listProjects("active"))[0] ?? null;
}

export async function activateProject(id: string): Promise<void> {
  const p = await getProject(id);
  if (!p) throw new DomainError("Project not found");
  if (p.status === "completed") throw new DomainError("Completed projects can't be activated");
  if (p.status === "active") return;
  const active = await getActiveProject();
  if (active) throw new DomainError(`"${active.name}" is already active. Save & switch first.`);
  await run(
    `UPDATE projects SET status = 'active', park_reason = NULL, resume_condition = NULL, updated_at = $1
     WHERE id = $2`,
    [now(), id]
  );
}

export async function parkProject(id: string, reason?: string, resumeCondition?: string): Promise<void> {
    await closeOpenSession(id);
    await run(
    `UPDATE projects SET status = 'parked', park_reason = $1, resume_condition = $2, updated_at = $3
     WHERE id = $4 AND status != 'completed'`,
    [reason ?? null, resumeCondition ?? null, now(), id]
  );
}

export async function finishProject(id: string): Promise<void> {
  await closeOpenSession(id);
    const t = now();
  await run(`UPDATE projects SET status = 'completed', completed_at = $1, updated_at = $1 WHERE id = $2`, [t, id]);
}

export async function deleteProject(id: string): Promise<void> {
  await run("DELETE FROM projects WHERE id = $1", [id]);
}