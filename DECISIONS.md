# Project OS Decisions

## Product

### One active project
Project OS allows only one project to be active at a time.

Reason:
The application is designed around focused project context rather
than managing many projects simultaneously.

### Desktop application
Project OS will initially be a desktop application.

Reason:
The application should integrate closely with the user's local
development environment.

### Project snapshots
When switching projects, the current project context is saved.

Reason:
Users should be able to return to an old project without
reconstructing where they stopped.

## Technology

### Tauri
Chosen for the desktop application shell.

### React + TypeScript
Chosen for the UI.

### SQLite
Chosen for local project data.

### Zustand
Chosen for lightweight application state.

### Zod
Chosen for runtime validation of application data.