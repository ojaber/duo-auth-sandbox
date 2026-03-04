# PRD: Light Mode Theme + Animated Theme Switcher

**Slug:** light-mode-theme
**Date:** 2026-03-03
**Status:** Draft

---

## Problem Statement

The duo-auth application currently supports only a dark theme (deep navy / indigo / cyan palette). Developers and testers using this sandbox in bright environments—offices, presentations, or personal preference—have no way to switch to a lighter, more readable theme. There is also no theme persistence, so system preference is never respected.

---

## Goals

1. Add a fully-styled **light mode theme** with warm whites, light grays, and the same indigo/purple accent palette adapted for light backgrounds.
2. Add an **animated theme switcher button** in the header — a sun/moon toggle with a satisfying flip/rotate animation.
3. Persist the user's preference in `localStorage` and respect the OS `prefers-color-scheme` as the default.
4. Keep the existing dark theme visually identical — zero regression.

---

## Visual Design Direction

### Light Mode Palette

| Variable | Light Value | Purpose |
|---|---|---|
| `--bg-primary` | `#f8f9fc` | Main page background (cool white) |
| `--bg-secondary` | `#f1f3f9` | Secondary background |
| `--card-bg` | `rgba(255,255,255,0.85)` | Card background (glassmorphic) |
| `--card-border` | `rgba(99,102,241,0.2)` | Card border (same accent family) |
| `--text-primary` | `#0f172a` | Main text (slate-900) |
| `--text-secondary` | `#475569` | Secondary text (slate-600) |
| `--text-muted` | `#94a3b8` | Muted text (slate-400) |
| `--text-code` | `#3730a3` | Code text (indigo-800) |
| Accents | Unchanged | Indigo, purple, cyan, green, red |
| `--shadow-*` | Softer, lighter shadows | Less dark, rgba(0,0,0,0.10-0.15) |
| `--shadow-glow` | Softer indigo glow | rgba(99,102,241,0.25) |
| Body background pattern | Same grid pattern | Opacity 0.04 instead of 0.05 |

### Theme Switcher Button

- **Location:** Right side of the `.app-header`, using `display: flex; justify-content: space-between`
- **Design:** Pill-shaped toggle button (~44×44px), with sun ☀️ icon in light mode, moon 🌙 icon in dark mode
- **Animation:** 360° rotation + scale bounce on toggle (CSS `@keyframes`)
- **Colors:** Adapts to current theme (dark bg in dark, light bg in light)
- **Accessibility:** `aria-label` dynamically updated, `role="button"`, keyboard accessible

---

## Component Structure

```
layout.html
├── <header class="app-header">
│   ├── <div class="logo">...</div>  (existing)
│   └── <button class="theme-toggle" ...>  (NEW)
│       └── <span class="theme-toggle-icon">
└── <script>  (NEW inline script for theme init + toggle)

style.css
├── :root { /* dark theme vars */ }  (existing)
├── [data-theme="light"] { /* light theme vars */ }  (NEW)
├── .theme-toggle { /* button styles */ }  (NEW)
├── .theme-toggle-icon { /* icon + animation */ }  (NEW)
└── @keyframes themeToggleSpin  (NEW)
```

**Theme is applied via `data-theme="light"` on `<html>` element.** Dark is the default (no attribute or `data-theme="dark"`).

---

## Accessibility Considerations

- Toggle button has `aria-label="Switch to light mode"` / `"Switch to dark mode"` updated dynamically
- `prefers-reduced-motion` suppresses the spin animation (just snaps)
- Color contrast in light mode verified: text-primary (#0f172a) on card-bg (#fff) = 18.9:1 ✓
- Input borders are visible in light mode (darker slate tones)
- Focus ring unchanged (indigo outline)

---

## Scope

### In Scope
- Light theme CSS variables (`[data-theme="light"]`)
- Theme toggle button in header
- Toggle animation (spin + scale)
- localStorage persistence
- System `prefers-color-scheme` default
- `meta[name="theme-color"]` update on toggle
- Input/form field adaptation for light mode
- Footer/header background for light mode

### Out of Scope
- Per-page theme overrides
- Multiple theme options (e.g. high contrast)
- Theme sync across browser tabs (not needed for sandbox)

---

## Acceptance Criteria

- [ ] Light mode activates when button is clicked
- [ ] Dark mode remains the default; light mode applies `data-theme="light"` on `<html>`
- [ ] All text meets WCAG AA contrast (4.5:1 minimum) in light mode
- [ ] Toggle button animates smoothly on click (360° spin + bounce)
- [ ] Preference persists across page reloads via `localStorage`
- [ ] System `prefers-color-scheme: light` is respected on first visit
- [ ] `aria-label` updates to reflect current state
- [ ] `prefers-reduced-motion` suppresses animation
- [ ] No visual regression on dark mode
