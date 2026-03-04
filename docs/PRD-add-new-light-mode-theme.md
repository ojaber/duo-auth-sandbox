# PRD: Light Mode Theme + Animated Theme Switcher

## Problem Statement

The duo-auth sandbox app currently ships only a dark theme — a deep midnight blue palette designed for late-night developer sessions. Developers who work in bright environments or who prefer lighter interfaces have no alternative. Additionally, the app lacks any mechanism to switch themes, so preferences are locked in at build time. This PR adds a polished light mode theme and a premium animated theme switcher so every developer gets an interface that fits their environment.

## Goals

1. Add a fully-fleshed "Solar Terminal" light mode theme that is distinct, warm, and visually cohesive — not just "inverted dark mode."
2. Implement a unique, animated theme switcher in the header that becomes a design signature of the app.
3. Persist the user's preference across sessions via `localStorage`.
4. Respect the OS `prefers-color-scheme` setting on first visit.
5. Keep all existing functionality — every page (login, auth_result, error) must look great in both themes.

---

## Visual Design Direction

### Light Theme: "Solar Terminal"

Rather than a clinical white-and-grey aesthetic, the light theme uses warm off-white cream tones that evoke a sunlit terminal. The accent colors (indigo, purple, cyan) stay the same — they pop just as nicely on light backgrounds.

**Color Palette:**
| Variable | Light Value | Notes |
|---|---|---|
| `--bg-primary` | `#fafaf7` | Warm cream, not pure white |
| `--bg-secondary` | `#f0efe8` | Slightly deeper cream |
| `--card-bg` | `rgba(255, 255, 253, 0.85)` | Near-white card with glass blur |
| `--card-border` | `rgba(99, 102, 241, 0.18)` | Keep indigo border |
| `--text-primary` | `#1e293b` | Deep slate, easy to read |
| `--text-secondary` | `#475569` | Medium slate |
| `--text-muted` | `#94a3b8` | Same as dark |
| `--text-code` | `#3730a3` | Deep indigo for code |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.06)` | Soft, warm |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.1)` | |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.12)` | |
| `--shadow-glow` | `0 0 40px rgba(99,102,241,0.25)` | Softer glow |

The background grid lines shift to warm indigo at 3% opacity instead of 5%. Gradients stay the same direction/colors — they unify both themes.

**Component adjustments in light mode:**
- `.app-header`: soft white/cream with warm border
- `.card::before` shimmer line: same indigo gradient (works on both)
- `.input` backgrounds: white with warm border
- `.kv-item`: warm cream backgrounds
- `.json-viewer`: soft warm cream with monochrome code tones
- `.collapsible`: warm cream backgrounds
- `.sandbox-banner`: warm amber-tinted instead of purple-tinted

---

## Theme Switcher: "Orbital Toggle"

A compact pill-shaped toggle button placed in the app header (right-aligned). It's unlike any typical sun/moon toggle — it features a **cosmic orbital animation**.

### Anatomy
```
╔═══════════════════════╗
║  🌙  [●══════]  ☀️   ║   ← dark mode (knob on left/moon side)
╚═══════════════════════╝

╔═══════════════════════╗
║  🌙  [══════●]  ☀️   ║   ← light mode (knob on right/sun side)
╚═══════════════════════╝
```

### Behavior
- **Knob**: slides across the track with a spring cubic-bezier (overshoot + settle)
- **Track**: background transitions from `#1e1b4b` (deep indigo) → `#fbbf24` (warm gold) as knob moves
- **Icons**: moon dims and sun brightens as the knob crosses the midpoint
- **Page transition**: when toggled, a radial burst overlay briefly sweeps across the entire page from the switcher's position, then fades — like a sunrise or a night falling

### Animation Details (CSS)
- Knob slide: `transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)` (spring with overshoot)
- Track color: `transition: background 0.5s ease`
- Page sweep: a fixed pseudo-element that scales from 0→200vmax then fades out, lasting ~600ms
- Icon crossfade: opacity transitions at 0.3s offset

### States
| State | Moon opacity | Sun opacity | Knob pos | Track color |
|---|---|---|---|---|
| Dark (default) | 1.0 | 0.35 | left | indigo-dark |
| Light | 0.35 | 1.0 | right | warm-gold |
| Transitioning | crossfades | crossfades | sliding | interpolating |

---

## Component Structure

**HTML changes (layout.html):**
- Add `data-theme` attribute to `<html>` tag (toggled via JS)
- Add `.theme-switcher` button in `.app-header` (right side, flex layout)
- Add inline JS in `<head>` to read localStorage and set `data-theme` before paint (prevents FOUC)

**CSS changes (style.css):**
- Add `[data-theme="light"]` block with all variable overrides
- Add `.theme-switcher` component styles + animations
- Add `.theme-transition-overlay` for the radial sweep effect
- Convert remaining hardcoded dark rgba values to use CSS variables

**JS (inline in layout.html `{% block scripts %}`):**
- `initTheme()` — reads localStorage / OS preference
- `toggleTheme()` — flips `data-theme`, triggers sweep animation, saves to localStorage
- Event listener on `.theme-switcher` button

---

## Accessibility

- Theme switcher has `role="switch"`, `aria-checked`, and `aria-label="Toggle light/dark theme"`
- Focus ring is visible in both themes
- Color contrast in light theme meets WCAG AA (≥4.5:1 for body text, ≥3:1 for UI)
- `prefers-reduced-motion` respected: if set, skip the radial sweep animation
- Theme preference saved, so users with assistive tech don't re-set on every page load

---

## Scope

**In scope:**
- Light mode CSS variables + per-component overrides
- Animated orbital toggle button (HTML + CSS + JS)
- Radial page-transition sweep animation
- localStorage persistence + OS preference detection
- All 4 templates visually verified: login, auth_result, error, layout

**Out of scope:**
- Adding additional themes (sepia, high-contrast) — future work
- Backend theme delivery — purely client-side
- Refactoring the CSS architecture to CSS-in-JS

---

## Acceptance Criteria

- [ ] Light mode looks polished and distinct from dark — warm, readable, with good contrast
- [ ] Theme switcher is present in the header on all pages
- [ ] Toggling plays the orbital animation on the button AND the page sweep
- [ ] Theme persists across page reloads via localStorage
- [ ] On first visit, respects OS `prefers-color-scheme`
- [ ] All WCAG AA contrast requirements met in light mode
- [ ] Works on mobile (375px) and desktop (1280px)
- [ ] Reduced motion: sweep animation disabled, toggle still works
- [ ] `aria-checked` updates correctly with each toggle
