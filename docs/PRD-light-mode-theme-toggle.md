# PRD: Light Mode Theme Toggle

**Feature slug:** `light-mode-theme-toggle`
**Branch:** `sp/build-light-mode-theme-to`
**Date:** 2026-03-03

---

## Problem Statement

The duo-auth app currently ships with a dark-only theme (deep navy background, indigo/cyan accents, dev-tool aesthetic). Developers and users who prefer light environments — or who work in bright office settings — have no way to switch to a light theme. Adding a persistent toggle improves usability and accessibility for this wider audience.

---

## Goals

1. Add a **light mode** CSS theme that looks polished and professional.
2. Provide a **toggle button** in the header so users can switch between dark and light themes.
3. **Persist** the user's preference in `localStorage` so it survives page reloads.
4. Respect the OS-level `prefers-color-scheme` setting as the initial default when no preference is stored.
5. Keep the toggle accessible (keyboard navigable, proper ARIA labels, visible focus ring).

---

## Visual Design Direction

### Light Mode Colors
- **Page background:** `#f8fafc` (very light cool grey) with a soft indigo radial gradient
- **Card background:** `rgba(255, 255, 255, 0.9)` — clean white with slight transparency
- **Card border:** `rgba(99, 102, 241, 0.2)` — indigo tint, subtle
- **Primary text:** `#0f172a` (near-black, high contrast)
- **Secondary text:** `#475569` (medium slate)
- **Muted text:** `#94a3b8`
- **Accent (primary):** `#6366f1` (indigo — same as dark mode for brand consistency)
- **Accent (cyan):** `#0891b2` — slightly deeper for light-mode contrast
- **Code text:** `#312e81` (deep indigo, readable on white)
- **Input background:** `rgba(248, 250, 252, 0.9)`
- **Input border:** `rgba(148, 163, 184, 0.4)`
- **Header background:** `rgba(255, 255, 255, 0.85)` with blur
- **Shadow:** softer, using `rgba(0,0,0,0.08–0.15)`

### Grid / Background
Light mode grid lines use `rgba(99, 102, 241, 0.04)` — barely visible.

### Toggle Button Design
- Lives in the **header**, right-aligned (already `justify-content: space-between`)
- **Icon-based:** sun ☀️ for dark mode (click to go light), moon 🌙 for light mode (click to go dark)
- Small pill-shaped button: `border-radius: 2rem`, ~36px tall
- Smooth transition on the icon swap
- `aria-label` updates dynamically: "Switch to light mode" / "Switch to dark mode"
- `aria-pressed` attribute reflects current state

---

## Component Structure

### Files changed
| File | Change |
|------|--------|
| `static/css/style.css` | Add `[data-theme="light"]` CSS variable block + theme toggle button styles |
| `templates/layout.html` | Add `<button>` toggle to `<header>`, add inline theme init script in `<head>` |

### Theme Init Script (inline, in `<head>`)
Reads `localStorage.getItem('theme')` and applies `data-theme` to `<html>` before the page paints — prevents FOUC (flash of unstyled content / wrong theme flash).

### Toggle Button Script
Lives in `{% block scripts %}` equivalent or as a small inline script in `layout.html`. Toggles `data-theme` on `<html>`, saves to `localStorage`, updates button `aria-label`.

---

## Accessibility Considerations

- Button has `aria-label` that accurately describes the **action** (what will happen), not current state: "Switch to light mode" when in dark mode.
- Button has `aria-pressed` set to `true` when light mode is active.
- Focus ring via existing `*:focus-visible` rule (already uses `--accent-primary`).
- Color contrast in light mode: all text colors must meet WCAG AA (4.5:1 for normal text, 3:1 for large text). Chosen values achieve this.
- Transitions disabled for `prefers-reduced-motion` users (already covered by existing `@media (prefers-reduced-motion)` rule).

---

## Scope

### In scope
- CSS variable overrides for light mode
- Toggle button in header
- `localStorage` persistence
- `prefers-color-scheme` as initial default
- All existing components (card, form inputs, buttons, badges, collapsibles, JSON viewer, error/success states, footer)

### Out of scope
- Server-side theme persistence (cookie/session) — overkill for a dev sandbox
- Multiple theme options beyond dark/light
- Theming the Duo iframe/redirect page (external, not controllable)

---

## Acceptance Criteria

- [ ] Dark mode (default) looks identical to current state
- [ ] Light mode provides clean, readable, professional appearance
- [ ] Toggle button is visible in the header on all pages
- [ ] Clicking toggle switches theme instantly (within one animation frame)
- [ ] Preference persists across page navigation and reloads
- [ ] OS dark mode preference is respected on first load when no stored preference
- [ ] Button is keyboard accessible and screen-reader friendly
- [ ] No flash of wrong theme on page load
- [ ] All text in light mode meets WCAG AA contrast
- [ ] Mobile header doesn't break (toggle fits alongside logo)
