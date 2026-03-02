# Product Requirements Document: Light Mode Theme Switcher

## Problem Statement
The duo-auth app currently only supports a dark theme. Users may prefer a light theme for better readability in bright environments, accessibility needs, or personal preference. Without a theme toggle, the app lacks flexibility for different user environments and preferences.

## Goals
1. **Add Light Mode Support**: Implement a comprehensive light theme that maintains the app's modern, professional aesthetic
2. **Smooth Theme Switching**: Create an animated, intuitive theme toggle that provides visual feedback
3. **Persistent Preference**: Remember user's theme choice across sessions
4. **Accessibility**: Ensure both themes meet WCAG AA contrast requirements

## Visual Design Direction

### Light Theme Colors
- **Backgrounds**:
  - Primary: `#ffffff` (pure white)
  - Secondary: `#f8fafc` (cool gray-50)
  - Card: `rgba(255, 255, 255, 0.95)` with subtle shadows
- **Accent Colors**: Keep existing vibrant colors but adjust for light backgrounds
  - Primary: `#4f46e5` (indigo-600, darker than dark mode)
  - Success: `#059669` (emerald-600)
  - Error: `#dc2626` (red-600)
- **Text Colors**:
  - Primary: `#0f172a` (slate-900)
  - Secondary: `#475569` (slate-600)
  - Muted: `#94a3b8` (slate-400)

### Theme Switcher Design
- **Style**: Animated toggle switch with sun/moon icons
- **Position**: Fixed in the top-right corner of the header
- **Animation**:
  - Smooth rotation transition for icons (300ms)
  - Background color morphing animation
  - Toggle slider with spring physics
- **Interaction States**:
  - Hover: Subtle scale (1.05) and glow effect
  - Active: Press down effect (scale 0.95)
  - Focus: Visible focus ring for keyboard navigation

### Animation Details
- **Toggle Animation**:
  - Sliding pill background that moves between sun/moon
  - Icons rotate 360° on switch for playful effect
  - Subtle bounce easing for satisfying feel
- **Theme Transition**:
  - Smooth 300ms transition for all color changes
  - Prevents jarring flash when switching

## Component Structure

### New Components
1. **ThemeSwitcher Component** (`/static/js/theme-switcher.js`)
   - Handles toggle logic
   - Manages localStorage persistence
   - Updates DOM data attributes

2. **CSS Variables Approach**
   - Use CSS custom properties for all colors
   - Switch color schemes via `data-theme` attribute on `<html>`
   - Maintain single CSS file with theme variations

### Modified Components
- `layout.html`: Add theme switcher in header
- `style.css`: Add light theme variables and theme-specific styles

## Accessibility Considerations
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Readers**: Proper ARIA labels ("Switch to light mode"/"Switch to dark mode")
- **Contrast Ratios**: All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Motion Preferences**: Respect `prefers-reduced-motion` for animations
- **System Preference**: Optionally detect and respect OS dark/light mode preference

## Scope

### In Scope
- Light theme color palette implementation
- Animated theme toggle switch with sun/moon icons
- localStorage persistence for theme preference
- Smooth transitions between themes
- Full page theme application (all components)
- Keyboard and screen reader accessibility

### Out of Scope
- Multiple theme presets beyond light/dark
- Color customization UI
- Theme scheduling (auto-switch based on time)
- Per-component theme overrides
- Theme export/import functionality

## Acceptance Criteria
1. ✅ Users can toggle between light and dark themes via an animated switch
2. ✅ Theme preference persists across browser sessions
3. ✅ All UI components properly styled in both themes
4. ✅ Smooth, non-jarring transition animations
5. ✅ Toggle is keyboard accessible with proper focus states
6. ✅ No layout shifts when switching themes
7. ✅ Light theme maintains professional, modern aesthetic
8. ✅ Both themes meet WCAG AA contrast requirements
9. ✅ Toggle animation is smooth and satisfying (spring physics)
10. ✅ Icons (sun/moon) clearly indicate current theme state

## Technical Implementation Notes
- Use CSS variables for maximum flexibility
- Implement theme logic in vanilla JavaScript (no framework needed)
- Store preference in localStorage with key `duo-auth-theme`
- Default to dark theme if no preference exists
- Consider system preference as fallback via `prefers-color-scheme`