"use client"

import { useTheme } from "./useTheme"

function SunIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ToggleSwitch() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-16 items-center rounded-full bg-gray-200 p-1 transition-colors duration-300 dark:bg-gray-700"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding knob */}
      <span
        className={`flex size-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-gray-900 ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <span className="text-blue-400">
            <MoonIcon />
          </span>
        ) : (
          <span className="text-amber-500">
            <SunIcon />
          </span>
        )}
      </span>

      {/* Background icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <span className={`text-amber-400 transition-opacity duration-300 ${isDark ? "opacity-40" : "opacity-0"}`}>
          <SunIcon />
        </span>
        <span className={`text-blue-300 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-40"}`}>
          <MoonIcon />
        </span>
      </span>
    </button>
  )
}
