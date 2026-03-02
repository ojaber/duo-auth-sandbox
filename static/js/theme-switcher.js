/**
 * Theme Switcher for Duo 2FA Testing Lab
 * Handles light/dark mode toggle with localStorage persistence
 */

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'theme-preference';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    // Initialize theme on page load
    function initializeTheme() {
        // Check for saved preference, otherwise check system preference
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? THEME_DARK : THEME_LIGHT);

        // Apply theme
        setTheme(currentTheme);
    }

    // Announce theme change to screen readers
    function announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Theme switched to ${theme} mode`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Set theme and update UI
    function setTheme(theme) {
        // Update data attribute
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button state
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            const isLight = theme === THEME_LIGHT;
            toggleBtn.setAttribute('aria-pressed', isLight.toString());
            toggleBtn.setAttribute('title', `Switch to ${isLight ? 'dark' : 'light'} mode`);

            // Update toggle visual state
            const toggleInput = document.getElementById('theme-toggle-checkbox');
            if (toggleInput) {
                toggleInput.checked = isLight;
            }
        }

        // Save preference
        localStorage.setItem(STORAGE_KEY, theme);

        // Announce to screen readers
        announceThemeChange(theme);
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        setTheme(newTheme);
    }

    // Set up event listeners
    function setupEventListeners() {
        // Theme toggle button click
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });

            // Keyboard accessibility
            toggleBtn.addEventListener('keydown', function(e) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }

        // Checkbox change (if using input-based toggle)
        const toggleInput = document.getElementById('theme-toggle-checkbox');
        if (toggleInput) {
            toggleInput.addEventListener('change', function() {
                const theme = this.checked ? THEME_LIGHT : THEME_DARK;
                setTheme(theme);
            });
        }

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', function(e) {
                // Only update if user hasn't set a preference
                if (!localStorage.getItem(STORAGE_KEY)) {
                    setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            setupEventListeners();
        });
    } else {
        // DOM is already ready
        initializeTheme();
        setupEventListeners();
    }
})();