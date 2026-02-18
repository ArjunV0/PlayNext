"use client"

import { useTheme } from "./useTheme"

export function ToggleSwitch() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors dark:bg-gray-700 dark:text-gray-200"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  )
}
