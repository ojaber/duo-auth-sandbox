# PRD: LightMode with Animated Switcher

## Problem Statement
The duo-auth sandbox app currently only offers a dark theme. Users who prefer light environments (bright offices, high-contrast accessibility needs) have no alternative. This PR adds a proper light theme and a polished animated toggle so users can switch on demand.

## Goals
- Provide a comfortable, high-contrast light mode that preserves the app's developer aesthetic
- Deliver a delightful animated sun/moon toggle switcher in the header
- Persist the user's preference across page reloads via `localStorage`
- Respect `prefers-color-scheme` system setting on first load
- Zero regressions on the existing dark theme

## Visual Design Direction

### Light Mode Colors
| Role | Dark Mode | Light Mode |
|------|-----------|------------|
| Background primary | `#0a0e1a` | `#f8fafc` |
| Background secondary | `#0f1419` | `#f1f5f9` |
| Card background | `rgba(20,26,39,0.7)` | `rgba(255,255,255,0.85)` |
| Card border | `rgba(99,102,241,0.25)` | `rgba(99,102,241,0.2)` |
| Text primary | `#f8fafc` | `#0f172a` |
| Text secondary | `#94a3b8` | `#475569` |
| Text muted | `#64748b` | `#94a3b8` |
| Grid lines | `rgba(99,102,241,0.05)` | `rgba(99,102,241,0.08)` |

Accent colors (indigo, violet, cyan, green, amber, red) remain the same in both modes — they're vivid enough to work on both backgrounds.

### Switcher Design
- **Shape**: Pill-shaped toggle track (40×22px) in the header top-right
- **Thumb**: Circular knob that slides left↔right with spring easing
- **Icons**: ☀️ sun icon (light mode active) / 🌙 moon icon (dark mode active)
- **Animation**:
  - Thumb slides with `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot / spring feel)
  - Icon crossfades/rotates during transition (180deg Y-flip)
  - Track color transitions smoothly (indigo→amber gradient in light mode)
- **Placement**: Right side of `.app-header`, next to the logo area (justified with `justify-content: space-between`)

### Transition Feel
- All color variables animate via `transition: background 0.3s, color 0.3s, border-color 0.3s` on `body` and `:root`-driven values
- Body gets `data-theme="light"` or `data-theme="dark"` attribute driven by JS
- CSS `[data-theme="light"]` block overrides the CSS variables

## Component Structure

```
layout.html
  ├── .app-header
  │     ├── .logo (existing)
  │     └── .theme-toggle-btn  ← NEW
  │           ├── .toggle-track
  │           │     └── .toggle-thumb
  │           ├── .toggle-icon--sun  (aria-hidden)
  │           └── .toggle-icon--moon (aria-hidden)
  └── [templates inherit]

style.css
  ├── :root { /* dark theme vars */ }
  ├── [data-theme="light"] { /* light theme overrides */ }
  ├── .theme-toggle-btn { /* toggle styles */ }
  └── .toggle-track, .toggle-thumb { /* animated switcher */ }

layout.html <script>
  └── Theme init + toggle handler (reads localStorage, writes data-theme)
```

## Accessibility Considerations
- `<button>` with `role="switch"` and `aria-checked="true/false"`
- `aria-label` = "Switch to light mode" / "Switch to dark mode" (dynamic)
- Visible focus ring via existing `*:focus-visible` rule
- High contrast ratios maintained in both themes (WCAG AA minimum)
- `prefers-reduced-motion` already handled globally in CSS

## Scope

### In Scope
- CSS light-theme variable overrides via `[data-theme="light"]`
- Animated pill switcher button in the header
- JS theme init + toggle (localStorage persistence + system preference detection)
- Body/html transition for smooth theme change

### Out of Scope
- Backend/server-side theme preference storage
- Per-page theme variations
- Refactoring existing CSS architecture

## Acceptance Criteria
- [ ] Clicking the switcher toggles the visual theme between dark and light
- [ ] The toggle thumb animates smoothly with a spring effect
- [ ] Preference persists on page reload (localStorage)
- [ ] On first load, `prefers-color-scheme: light` is respected
- [ ] Light mode has proper contrast for all text elements
- [ ] All existing pages (login, auth_result, error) render correctly in both modes
- [ ] Switcher has correct ARIA role/label for screen readers
- [ ] No animation regressions on `prefers-reduced-motion`
