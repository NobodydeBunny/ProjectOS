// Generated from the tested 001_init.sql. Append new migrations; never edit old ones.
// Applied in order; progress is tracked with PRAGMA user_version.
export const MIGRATIONS: string[][] = [
  // v1
  [
    `-- 001_init: Project OS core schema (one statement per block)
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  goal TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('active','backlog','parked','completed')),
  priority INTEGER NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  park_reason TEXT,
  resume_condition TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_worked_at TEXT,
  completed_at TEXT
)`,
    `CREATE UNIQUE INDEX idx_one_active_project ON projects(status) WHERE status = 'active'`,
    `CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','current','done')),
  created_at TEXT NOT NULL,
  completed_at TEXT
)`,
    `CREATE UNIQUE INDEX idx_one_current_milestone ON milestones(project_id) WHERE status = 'current'`,
    `CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_seconds INTEGER,
  notes TEXT NOT NULL DEFAULT ''
)`,
    `CREATE UNIQUE INDEX idx_one_open_session ON sessions(project_id) WHERE ended_at IS NULL`,
    `CREATE TABLE actions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current','done','skipped')),
  created_at TEXT NOT NULL,
  completed_at TEXT,
  completed_in_session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL
)`,
    `CREATE UNIQUE INDEX idx_one_current_action ON actions(project_id) WHERE status = 'current'`,
    `CREATE TABLE snapshots (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  milestone_title TEXT,
  action_title TEXT,
  summary TEXT NOT NULL DEFAULT '',
  resume_action TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
)`,
    `CREATE TABLE ideas (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','planned','done','dismissed')),
  created_at TEXT NOT NULL
)`,
    `CREATE TABLE decisions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL
)`,
    `CREATE TABLE blockers (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT
)`,
    `CREATE TABLE dod_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0,1)),
  completed_at TEXT
)`,
    `CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('folder','repo','docs','link')),
  label TEXT NOT NULL DEFAULT '',
  value TEXT NOT NULL
)`,
    `CREATE INDEX idx_milestones_project ON milestones(project_id, position)`,
    `CREATE INDEX idx_sessions_project ON sessions(project_id, started_at)`,
    `CREATE INDEX idx_actions_project ON actions(project_id, created_at)`,
    `CREATE INDEX idx_snapshots_project ON snapshots(project_id, created_at)`,
    `CREATE INDEX idx_ideas_project ON ideas(project_id, created_at)`,
    `CREATE INDEX idx_decisions_project ON decisions(project_id, created_at)`,
    `CREATE INDEX idx_blockers_project ON blockers(project_id, created_at)`,
    `CREATE INDEX idx_dod_project ON dod_items(project_id, position)`,
    `CREATE INDEX idx_resources_project ON resources(project_id)`,
  ],
];
