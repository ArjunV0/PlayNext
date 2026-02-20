"use client"

import { SearchInput } from "features/search/SearchInput"
import { ToggleSwitch } from "features/theme/ToggleSwitch"

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/60">
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient shrink-0 text-lg font-bold">PlayNext</h1>
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
    </header>
  )
}
