"use client"

import { SearchInput } from "features/search/SearchInput"
import { SidebarTrigger } from "features/navigation"
import { ToggleSwitch } from "features/theme/ToggleSwitch"

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl dark:bg-gray-900/60">
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          {/* Logo with ambient-influenced gradient and hover underline */}
          <div className="group relative shrink-0">
            <h1
              className="text-lg font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #818cf8, hsl(var(--ambient-h, 240) var(--ambient-s, 70%) var(--ambient-l, 60%)), #c084fc, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PlayNext
            </h1>
            {/* Animated hover underline */}
            <span
              className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
              style={{
                background:
                  "linear-gradient(90deg, #818cf8, hsl(var(--ambient-h, 240) var(--ambient-s, 70%) var(--ambient-l, 60%)), #c084fc, #f472b6)",
              }}
            />
          </div>
          <div className="hidden flex-1 sm:block">
            <SearchInput />
          </div>
          <div className="flex-1 sm:hidden" />
          <ToggleSwitch />
        </div>
        <div className="mt-2 sm:hidden">
          <SearchInput />
        </div>
      </div>
      {/* Gradient separator glow line */}
      <div
        className="h-px w-full opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, #818cf8, #c084fc, #f472b6, transparent)",
        }}
      />
    </header>
  )
}
