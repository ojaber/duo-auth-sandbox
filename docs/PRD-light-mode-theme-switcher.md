# PRD: Light Mode Theme + Animated Theme Switcher

**Task:** Add a light mode theme with a cool animated theme switcher
**Branch:** sp/add-new-light-mode-theme-
**Date:** 2026-03-03

---

## Problem Statement

The duo-auth sandbox app currently has only a dark theme hardcoded into its CSS. Developers who prefer working in bright environments, or who use the app during daytime alongside other light-mode tools, have no way to switch. There's also no theme preference persistence — every visit resets to dark.

---

## Goals

1. Add a complete, polished **light mode** theme that maintains the app's professional dev-tool aesthetic.
2. Provide an **animated theme switcher** button in the header that toggles between modes.
3. **Persist** the user's preference via `localStorage`.
4. **Respect** `prefers-color-scheme` on first load if no preference is stored.
5. Ensure smooth, non-jarring **transitions** between themes across all components.

---

## Visual Design Direction

### Light Mode Palette

| Variable | Value | Usage |
|---|---|---|
| `--bg-primary` | `#f0f4ff` | Page background (very light indigo-tinted) |
| `--bg-secondary` | `#e8eeff` | Secondary surfaces |
| `--card-bg` | `rgba(255, 255, 255, 0.85)` | Cards (glassmorphism still applies) |
| `--card-border` | `rgba(99, 102, 241, 0.2)` | Card borders |
| `--text-primary` | `#0f172a` | Primary text (dark navy) |
| `--text-secondary` | `#475569` | Secondary text |
| `--text-muted` | `#94a3b8` | Muted/hint text |
| `--text-code` | `#3730a3` | Code/mono text |
| `--shadow-sm` | `0 2px 8px rgba(99, 102, 241, 0.08)` | Subtle shadow |
| `--shadow-md` | `0 4px 16px rgba(99, 102, 241, 0.12)` | Medium shadow |
| `--shadow-lg` | `0 8px 32px rgba(99, 102, 241, 0.15)` | Large shadow |
| `--shadow-glow` | `0 0 40px rgba(99, 102, 241, 0.2)` | Glow effect |

Accent colors (`--accent-primary`, `--accent-secondary`, `--accent-cyan`, `--accent-success`, `--accent-warning`, `--accent-error`) remain the same — they work on both light and dark backgrounds.

### Background Pattern (Light Mode)
- Background: light lavender-tinted white (`#f0f4ff`)
- Grid lines: `rgba(99, 102, 241, 0.06)` (softer than dark mode)
- Radial gradient: soft indigo glow at top, very low opacity
- The glassmorphism card effect is preserved with `backdrop-filter: blur(20px)`

### Header & Footer (Light Mode)
- Header: `rgba(255, 255, 255, 0.8)` with `backdrop-filter: blur(12px)`, indigo border
- Footer: `rgba(255, 255, 255, 0.5)`, slightly transparent
- Sandbox banner: lighter purple tint, still distinctive

### Form Elements (Light Mode)
- Inputs: white background (`rgba(255, 255, 255, 0.9)`), light border
- Focus state: cyan glow (same as dark mode, but slightly reduced opacity)
- Placeholder: `#94a3b8`

### JSON Viewer / Code Blocks (Light Mode)
- Background: `rgba(240, 244, 255, 0.9)` (light lavender)
- Syntax colors: slightly richer for readability on light
- `.json-key`: `#4f46e5` (indigo), `.json-string`: `#059669` (green), `.json-number`: `#d97706`, `.json-boolean`: `#db2777`, `.json-null`: `#94a3b8`

---

## Theme Switcher Component

### Visual Design: iOS-style Pill Toggle
```
Dark:  [🌙 ··· ●]    Light: [● ··· ☀️]
        track   thumb         thumb  track
```

- A pill-shaped toggle track (~48×26px) in the header
- The thumb slides left/right with a smooth spring animation
- Icon inside the thumb: 🌙 (moon) in dark mode, ☀️ (sun) in light mode
- The track background transitions between dark indigo and a warm amber/yellow tint
- Micro-animation: the icon spins/scales slightly on switch
- Accessible: `role="switch"`, `aria-checked`, `aria-label="Toggle theme"`

### Placement
- Right side of the header, aligned with the logo
- The `.app-header` gets `justify-content: space-between` to push it to the right

### Animation Sequence (on click)
1. Thumb slides across the track (300ms cubic-bezier spring)
2. Icon inside thumb rotates 360° (400ms)
3. Page colors transition smoothly (400ms CSS transitions on `body`, `card`, etc.)
4. Moon → Sun or Sun → Moon icon swap at midpoint of rotation

---

## Component Structure

**Modified files:**
1. `templates/layout.html` — Add theme switcher button HTML in header; add inline JS for theme init (before first paint to prevent FOUC); add theme toggle script in `<head>` or early `<body>`
2. `static/css/style.css` — Add `[data-theme="light"]` CSS variable overrides; add theme-switcher styles; add smooth transition declarations on `body`, `.card`, `input`, etc.

**No new files needed** — this stays within the existing architecture.

---

## Accessibility Considerations

- Toggle button has `role="switch"` and `aria-checked` reflecting current state
- `aria-label="Switch to light mode"` / `"Switch to dark mode"` updated dynamically
- Focus ring visible in both themes (uses `--accent-primary` outline)
- Color contrast in light mode: all text/background combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- `prefers-reduced-motion`: theme switch animations disabled
- Theme init script runs synchronously before paint to prevent flash of wrong theme (FOUC)

---

## Scope

### In scope
- CSS light theme variables
- Animated theme switcher button in header
- localStorage persistence
- `prefers-color-scheme` detection on first visit
- Smooth CSS transitions during theme switch
- All existing pages: login, auth_result, error

### Out of scope
- High-contrast accessibility mode
- Per-page theme settings
- System tray / OS integration beyond `prefers-color-scheme`
- Dark reader extension compatibility
- New pages or routes

---

## Acceptance Criteria

1. ✅ App loads in the user's preferred theme without flash (FOUC prevention)
2. ✅ Clicking the switcher toggles between dark and light mode
3. ✅ Theme preference persists across page reloads and navigations
4. ✅ Switcher has a smooth animation (thumb slide + icon rotation)
5. ✅ All text has sufficient contrast in both themes
6. ✅ All components (form, card, badges, JSON viewer, footer) look polished in light mode
7. ✅ Works on mobile viewport (≤640px)
8. ✅ `prefers-color-scheme: light` is respected on first visit
9. ✅ `prefers-reduced-motion` disables animations but not the toggle itself
