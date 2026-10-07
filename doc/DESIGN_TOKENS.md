# Project OS: Design Tokens

Theme: dark only. Stack: React + Tailwind + shadcn/ui.

---

## 1. Colors

### Surfaces (darkest to lightest)

| Token | Hex | Use |
|---|---|---|
| `surface-container-lowest` | `#080f16` | Inset panels, status chip backgrounds |
| `background` / `surface` / `surface-dim` | `#0d141c` | App background |
| `surface-container-low` | `#151c24` | Sidebar, panels |
| `surface-container` | `#192028` | Cards, hover rows, inputs |
| `surface-container-high` | `#242b33` | Active nav item, kbd, selected |
| `surface-container-highest` | `#2e353e` | Logo tile, kbd on dark, `surface-variant` |
| `surface-bright` | `#333a43` | Brightest surface |

### Text

| Token | Hex | Use |
|---|---|---|
| `on-surface` / `on-background` | `#dce3ee` | Primary text |
| `on-surface-variant` | `#c7c4d7` | Secondary text, inactive nav |
| `outline` | `#908fa0` | Muted labels, section captions |
| `outline-variant` | `#464554` | Borders (used at 20-30% opacity) |

### Brand / accent

| Token | Hex | Use |
|---|---|---|
| `primary` | `#c0c1ff` | Main accent, active dot, icons, glows |
| `primary-container` | `#8083ff` | Filled accent surfaces |
| `on-primary` | `#1000a9` | Text on `primary` (also used at 20% as bg) |
| `on-primary-container` | `#0d0096` | Text on `primary-container` |
| `inverse-primary` | `#494bd6` | Strong indigo |
| `secondary` | `#bdc2ff` | Secondary accent |
| `secondary-container` | `#2f3aa3` | Secondary filled (30% opacity common) |
| `on-secondary` / `on-secondary-container` | `#131e8c` / `#a8afff` | |
| `tertiary` | `#7bd0ff` | Info / runtime / passive status (cyan) |
| `tertiary-container` | `#009bd1` | Cyan filled (30% opacity common) |
| `on-tertiary` / `on-tertiary-container` | `#00354a` / `#002d40` | |

### Error

| Token | Hex |
|---|---|
| `error` | `#ffb4ab` |
| `on-error` | `#690005` |
| `error-container` | `#93000a` |
| `on-error-container` | `#ffdad6` |

### Fixed / tint (defined but rarely used)

`primary-fixed #e1e0ff` · `primary-fixed-dim #c0c1ff` · `on-primary-fixed #07006c` · `on-primary-fixed-variant #2f2ebe`
`secondary-fixed #e0e0ff` · `secondary-fixed-dim #bdc2ff` · `on-secondary-fixed #000767` · `on-secondary-fixed-variant #2f3aa3`
`tertiary-fixed #c4e7ff` · `tertiary-fixed-dim #7bd0ff` · `on-tertiary-fixed #001e2c` · `on-tertiary-fixed-variant #004c69`
`inverse-surface #dce3ee` · `inverse-on-surface #2a313a` · `surface-tint #c0c1ff`

### Status colors (hardcoded in screens, not in the token set)

Used on the Projects Switcher for project states. Add these as real tokens.

| Token (proposed) | Hex | Use |
|---|---|---|
| `status-success` | `#10B981` | Completed / healthy (`/10`-`/20` bg, solid text) |
| `status-warning` | `#F59E0B` | Parked / pending (`/10` bg, solid text) |

Suggested project-state mapping (to confirm): ACTIVE = `primary`, BACKLOG = `tertiary`, PARKED = `status-warning`, COMPLETED = `status-success`.

### Common opacity patterns

`bg-primary/10` · `bg-primary/20` · `bg-primary/5` · `bg-on-primary/20` · `bg-tertiary-container/30` · `bg-secondary-container/30` · `bg-primary-container/20` · `bg-surface/80` (+ `backdrop-blur-xl` for the top bar) · `border-outline-variant/30` · `border-outline-variant/20` · `bg-error/10`

---

## 2. Typography

Fonts: **Inter** (UI), **JetBrains Mono** (paths, timestamps, versions, kbd, IDs).
Note: JetBrains Mono is declared in the config but the screens only load Inter. Load it explicitly.

| Token | Size / Line | Weight | Letter spacing | Font |
|---|---|---|---|---|
| `display-lg` | 32 / 40 | 600 | -0.02em | Inter |
| `display-md` | 24 / 32 | 600 | -0.015em | Inter |
| `headline-lg` | 18 / 24 | 600 | -0.01em | Inter |
| `headline-md` | 15 / 20 | 600 | -0.005em | Inter |
| `body-lg` | 14 / 20 | 400 | 0 | Inter |
| `body-md` | 13 / 18 | 400 | 0 | Inter (default body) |
| `body-sm` | 12 / 16 | 400 | 0.005em | Inter |
| `label-md` | 12 / 16 | 500 | 0.01em | Inter |
| `label-sm` | 11 / 14 | 600 | 0.02em | Inter (often uppercase + `tracking-wider`) |
| `code-md` | 12 / 16 | 400 | -0.01em | JetBrains Mono |
| `code-sm` | 11 / 14 | 400 | 0 | JetBrains Mono |

---

## 3. Spacing

Strict 4px grid. Named Tailwind spacing keys:

| Token | Value |
|---|---|
| `space-2xs` | 0.125rem (2px) |
| `space-xs` | 0.25rem (4px) |
| `space-sm` / `gutter-compact` / `margin-panel` | 0.5rem (8px) |
| `space-md` / `gutter` | 0.75rem (12px) |
| `space-lg` / `gutter-wide` / `margin` | 1rem (16px) |
| `space-xl` | 1.5rem (24px) |
| `space-2xl` | 2rem (32px) |

---

## 4. Radius

Values as set in the screens' Tailwind config:

| Class | Value |
|---|---|
| `rounded` (DEFAULT) | 0.125rem (2px) |
| `rounded-lg` | 0.25rem (4px) |
| `rounded-xl` | 0.5rem (8px) |
| `rounded-full` | **0.75rem (12px)**, not a true circle |

See Conflicts #2.

---

## 5. Elevation & effects

No heavy drop shadows; depth comes from tonal surfaces. Glows mark active state.

| Name | Value | Use |
|---|---|---|
| Panel shadow | `0 1px 8px rgba(0,0,0,0.04)` | Sidebar, top bar (most common) |
| Glow, primary dot | `0 0 8px #c0c1ff` | Active-project dot |
| Glow, tertiary dot | `0 0 8px #7bd0ff` (or `0 0 6px`) | Runtime / idle dot |
| Glow, primary soft | `0 0 16px rgba(192,193,255,0.25-0.35)` | Primary buttons / highlighted cards |
| Glow, primary wide | `0 0 20px rgba(192,193,255,0.2-0.25)` | Hero cards |
| Modal shadow | `0 24px 64px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(192,193,255,0.15)` | Modals |
| Decorative blur | `blur-3xl` + `bg-[color]/10` large circle | Card ambient glow |

---

## 6. Layout

| Element | Value |
|---|---|
| Sidebar | fixed, `w-64` (256px), `bg-surface-container-low`, `p-space-md` |
| Top bar | fixed, `h-14` (56px), `bg-surface/80 backdrop-blur-xl`, `px-gutter-wide` |
| Main content | `pl-64 pt-14`, container `max-w-6xl mx-auto py-space-xl px-gutter-wide gap-space-xl` |
| Modals | widths seen: `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`, `max-w-3xl`, `w-[720px]` |

Navigation items: Home, Projects, Ideas Backlog, History (top group "Workspace"); Command (⌘K) search, Settings (bottom).
Nav active class: `bg-surface-container-high text-on-surface font-headline-md rounded-lg`.
Nav inactive: `text-on-surface-variant hover:bg-surface-container hover:text-on-surface`.

---

## 7. Icons

The screens use **Material Symbols Outlined** (Google), not Lucide.
Most used: `lightbulb`, `terminal`, `tune`, `check`, `folder_open`, `bolt`, `search`, `schedule`, `dashboard`, `timer`, `arrow_forward`, `open_in_new`, `history`, `check_circle`, `swap_horiz`, `lock`, `smart_toy`, `play_arrow`, `memory`, `info`, `close`, `check_box_outline_blank`, `verified`, `sync`, `flag`, `checklist`, `add`, `save`, `pause_circle`.
Default icon size in the screens: `text-headline-md` (15px).

---

## 8. Screens included

Home, Workspace, Projects Switcher, Project Details (AI Desktop Agent), Re-entry Briefing (ARGUS), Session Snapshot, Switch Project modal, Idea Capture modal, What Should I Work On, Finish Project.
(`change_only_the_colors...` contains only a PNG, no code.)

---

## 9. Conflicts to resolve before coding

1. **Two palettes in `DESIGN.md`.** The front matter (`#0d141c` surface, `#c0c1ff` primary) matches the screens. The prose describes a different one (`#0B0F14` / `#6366F1` / `#26313D`). The "What Should I Work On" screen leaks the prose palette (`#6366F1`, `#818CF8` in an image prompt and text). **Decision: use the front-matter palette in this file.** Ignore the prose colors.
2. **Radius mismatch.** `DESIGN.md` says 4/8/12px for base/lg/xl; the screens' config shifts everything down (2/4/8px) and sets `rounded-full` to 12px, so 32px avatars render as rounded squares. **Decision needed:** follow the screens as-is, or keep the screens' scale and add a true `rounded-pill: 9999px` for avatars and dots.
3. **Icon set.** The design uses Material Symbols, while the project brief says Lucide. Pick one. Using Material Symbols avoids re-mapping 40+ icons.
4. **Hardcoded status colors** (`#10B981`, `#F59E0B`) exist only on one screen. Promoted to tokens above.
5. **Fonts.** Load Inter and JetBrains Mono locally (bundle them). The app is desktop and local-first, so don't rely on Google Fonts at runtime.

---

## 10. Tailwind config (drop-in)

```js
// tailwind.config.js
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0d141c", surface: "#0d141c", "surface-dim": "#0d141c",
        "surface-bright": "#333a43",
        "surface-container-lowest": "#080f16", "surface-container-low": "#151c24",
        "surface-container": "#192028", "surface-container-high": "#242b33",
        "surface-container-highest": "#2e353e", "surface-variant": "#2e353e",
        "on-surface": "#dce3ee", "on-background": "#dce3ee", "on-surface-variant": "#c7c4d7",
        outline: "#908fa0", "outline-variant": "#464554",
        "inverse-surface": "#dce3ee", "inverse-on-surface": "#2a313a", "surface-tint": "#c0c1ff",
        primary: "#c0c1ff", "on-primary": "#1000a9",
        "primary-container": "#8083ff", "on-primary-container": "#0d0096", "inverse-primary": "#494bd6",
        secondary: "#bdc2ff", "on-secondary": "#131e8c",
        "secondary-container": "#2f3aa3", "on-secondary-container": "#a8afff",
        tertiary: "#7bd0ff", "on-tertiary": "#00354a",
        "tertiary-container": "#009bd1", "on-tertiary-container": "#002d40",
        error: "#ffb4ab", "on-error": "#690005",
        "error-container": "#93000a", "on-error-container": "#ffdad6",
        "primary-fixed": "#e1e0ff", "primary-fixed-dim": "#c0c1ff",
        "on-primary-fixed": "#07006c", "on-primary-fixed-variant": "#2f2ebe",
        "secondary-fixed": "#e0e0ff", "secondary-fixed-dim": "#bdc2ff",
        "on-secondary-fixed": "#000767", "on-secondary-fixed-variant": "#2f3aa3",
        "tertiary-fixed": "#c4e7ff", "tertiary-fixed-dim": "#7bd0ff",
        "on-tertiary-fixed": "#001e2c", "on-tertiary-fixed-variant": "#004c69",
        "status-success": "#10B981", "status-warning": "#F59E0B",
      },
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem", pill: "9999px" },
      spacing: {
        "space-2xs": "0.125rem", "space-xs": "0.25rem", "space-sm": "0.5rem", "space-md": "0.75rem",
        "space-lg": "1rem", "space-xl": "1.5rem", "space-2xl": "2rem",
        gutter: "0.75rem", "gutter-compact": "0.5rem", "gutter-wide": "1rem",
        margin: "1rem", "margin-panel": "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-lg": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["15px", { lineHeight: "20px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "body-lg": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["13px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.005em", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "600" }],
        "code-md": ["12px", { lineHeight: "16px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "code-sm": ["11px", { lineHeight: "14px", letterSpacing: "0em", fontWeight: "400" }],
      },
    },
  },
};
```

## 11. shadcn/ui variable mapping (starting point)

```css
:root {
  --background: #0d141c;
  --foreground: #dce3ee;
  --card: #192028;           --card-foreground: #dce3ee;
  --popover: #192028;        --popover-foreground: #dce3ee;
  --primary: #c0c1ff;        --primary-foreground: #1000a9;
  --secondary: #242b33;      --secondary-foreground: #dce3ee;
  --muted: #192028;          --muted-foreground: #908fa0;
  --accent: #242b33;         --accent-foreground: #dce3ee;
  --destructive: #ffb4ab;    --destructive-foreground: #690005;
  --border: rgba(70, 69, 84, 0.3);   /* outline-variant / 30 */
  --input: rgba(70, 69, 84, 0.3);
  --ring: #c0c1ff;
  --radius: 0.25rem;
}
```