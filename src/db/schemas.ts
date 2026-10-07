import { z } from "zod";

// ---------- enums ----------
export const ProjectStatus = z.enum(["active", "backlog", "parked", "completed"]);
export const MilestoneStatus = z.enum(["upcoming", "current", "done"]);
export const ActionStatus = z.enum(["current", "done", "skipped"]);
export const IdeaStatus = z.enum(["new", "planned", "done", "dismissed"]);
export const ResourceKind = z.enum(["folder", "repo", "docs", "link"]);
export const PARK_REASONS = [
  "Lost interest", "Too large", "Blocked", "Not enough time",
  "Higher priority project", "Skill gap", "Waiting for something", "Other",
] as const;

// ---------- inputs (validated) ----------
const text = z.string().trim().min(1).max(2000);
export const CreateProjectInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).default(""),
  goal: z.string().trim().max(2000).default(""),
  priority: z.number().int().min(1).max(3).default(2), // 1 high, 2 normal, 3 low
});
export const UpdateProjectInput = CreateProjectInput.partial();
export const SnapshotInput = z.object({
  summary: z.string().trim().max(4000).default(""),     // "What did you do?"
  resumeAction: z.string().trim().max(1000).default(""), // "What should you do on return?"
  notes: z.string().trim().max(4000).default(""),
});
export const TextInput = text;

// ---------- rows (as returned by SQLite; snake_case matches the DB) ----------
export type ProjectStatus = z.infer<typeof ProjectStatus>;
export interface Project {
  id: string; name: string; description: string; goal: string;
  status: ProjectStatus; priority: number;
  park_reason: string | null; resume_condition: string | null;
  created_at: string; updated_at: string;
  last_worked_at: string | null; completed_at: string | null;
}
export interface Milestone {
  id: string; project_id: string; title: string; description: string; position: number;
  status: z.infer<typeof MilestoneStatus>; created_at: string; completed_at: string | null;
}
export interface Action {
  id: string; project_id: string; milestone_id: string | null; title: string;
  status: z.infer<typeof ActionStatus>; created_at: string; completed_at: string | null;
  completed_in_session_id: string | null;
}
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
  status: z.infer<typeof IdeaStatus>; created_at: string;
}
export interface Decision { id: string; project_id: string; session_id: string | null; text: string; created_at: string }
export interface Blocker { id: string; project_id: string; session_id: string | null; text: string; created_at: string; resolved_at: string | null }
export interface DodItem { id: string; project_id: string; title: string; position: number; done: 0 | 1; completed_at: string | null }
export interface Resource { id: string; project_id: string; kind: z.infer<typeof ResourceKind>; label: string; value: string }
