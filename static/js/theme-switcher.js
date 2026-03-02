/**
 * Theme Switcher Module for Duo 2FA Testing Lab
 * Handles theme toggling with localStorage persistence and smooth transitions
 */

(function() {
    'use strict';

    // Cache DOM elements
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Initialize theme system
    function initializeTheme() {
        // Get stored theme or detect system preference
        const storedTheme = localStorage.getItem('duo-theme');

        if (storedTheme) {
            applyTheme(storedTheme);
        } else {
            // No stored preference - check system
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }

        // Listen for system theme changes (when no manual preference set)
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem('duo-theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
    }

    // Apply theme to DOM and update UI
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        updateToggleState(theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#0a0e1a' : '#f8f9fc';
        }
    }

    // Update toggle button ARIA states and labels
    function updateToggleState(theme) {
        if (!themeToggle) return;

        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', !isDark);
        themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Store preference
        localStorage.setItem('duo-theme', newTheme);

        // Apply theme with animation
        applyTheme(newTheme);

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: newTheme }
        }));

        // Announce change to screen readers
        announceThemeChange(newTheme);
    }

    // Announce theme change for accessibility
    function announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `Theme changed to ${theme} mode`;

        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Handle keyboard navigation
    function handleKeyboard(e) {
        // Space or Enter should toggle
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleTheme();

            // Add pressed animation class
            themeToggle.classList.add('theme-toggle--pressed');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle--pressed');
            }, 200);
        }
    }

    // Handle toggle button animations
    function handleToggleAnimation() {
        // Add animation class for spring effect
        themeToggle.classList.add('theme-toggle--animating');

        // Clean up after animation
        themeToggle.addEventListener('transitionend', function cleanup(e) {
            if (e.propertyName === 'transform') {
                themeToggle.classList.remove('theme-toggle--animating');
                // Release GPU optimization
                const slider = themeToggle.querySelector('.theme-toggle-slider');
                if (slider) {
                    slider.style.willChange = 'auto';
                }
                themeToggle.removeEventListener('transitionend', cleanup);
            }
        });

        // Optimize for animation
        const slider = themeToggle.querySelector('.theme-toggle-slider');
        if (slider) {
            slider.style.willChange = 'transform';
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        if (!themeToggle) return;

        // Click handler
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            handleToggleAnimation();
            toggleTheme();
        });

        // Keyboard handler
        themeToggle.addEventListener('keydown', handleKeyboard);

        // Hover effects
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.classList.add('theme-toggle--hover');
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.classList.remove('theme-toggle--hover');
        });

        // Active state
        themeToggle.addEventListener('mousedown', () => {
            themeToggle.classList.add('theme-toggle--active');
        });

        themeToggle.addEventListener('mouseup', () => {
            themeToggle.classList.remove('theme-toggle--active');
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.classList.remove('theme-toggle--active');
        });
    }

    // Check for reduced motion preference
    function respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            htmlElement.classList.add('reduced-motion');
        } else {
            htmlElement.classList.remove('reduced-motion');
        }

        // Listen for changes
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', (e) => {
                if (e.matches) {
                    htmlElement.classList.add('reduced-motion');
                } else {
                    htmlElement.classList.remove('reduced-motion');
                }
            });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeTheme();
            setupEventListeners();
            respectReducedMotion();
        });
    } else {
        // DOM already loaded
        initializeTheme();
        setupEventListeners();
        respectReducedMotion();
    }

    // Export for testing or external use
    window.DuoThemeManager = {
        toggle: toggleTheme,
        setTheme: applyTheme,
        getTheme: () => htmlElement.getAttribute('data-theme') || 'dark'
    };
})();

// Screen reader only styles (add to CSS if not present)
if (!document.querySelector('style[data-sr-only]')) {
    const srOnlyStyles = document.createElement('style');
    srOnlyStyles.setAttribute('data-sr-only', 'true');
    srOnlyStyles.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(srOnlyStyles);
}