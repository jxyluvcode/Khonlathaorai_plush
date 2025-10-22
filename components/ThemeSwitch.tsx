'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

/**
 * ThemeSwitch component for toggling between light and dark mode
 */
export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => {
        // Toggle between light and dark, respecting system preference
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('light');
        } else {
            // If system, toggle to opposite of current system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            setTheme(systemTheme === 'dark' ? 'light' : 'dark');
        }
    };

    // Get current effective theme (resolve 'system' to actual theme)
    const effectiveTheme = mounted 
        ? theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            : theme
        : 'light';

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="relative"
                isDisabled
            >
                <div className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onPress={toggleTheme}
            aria-label={effectiveTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="relative transition-transform hover:scale-110"
        >
            {/* Sun icon for light mode */}
            <svg
                className={`absolute h-5 w-5 transition-all ${effectiveTheme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
                    }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>

            {/* Moon icon for dark mode */}
            <svg
                className={`absolute h-5 w-5 transition-all ${effectiveTheme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                    }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
            </svg>
        </Button>
    );
}
