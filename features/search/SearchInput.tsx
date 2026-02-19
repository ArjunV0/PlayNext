"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useSearch } from "./useSearch"
import { SearchResults } from "./SearchResults"

function SearchIcon() {
  return (
    <svg
      className="size-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function SearchInput() {
  const { query, setQuery, isLoading, recentSearches, clearRecentSearches } = useSearch()
  const isQueryEmpty = query.trim() === ""
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showDropdown = isFocused && (recentSearches.length > 0 || !isQueryEmpty)

  const closeDropdown = useCallback(() => {
    setIsFocused(false)
  }, [])

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
    setIsFocused(true)
  }

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
      }
    }
  }, [])

  const handleRecentClick = (term: string): void => {
    setQuery(term)
  }

  const handleClear = () => {
    setQuery("")
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        {/* Search icon */}
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search songs or artists..."
          className="w-full rounded-xl border border-gray-200/60 bg-gray-50/80 py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500/50 focus:bg-white focus:shadow-lg focus:ring-1 focus:shadow-blue-500/5 focus:ring-blue-500/30 focus:outline-none dark:border-gray-600/60 dark:bg-gray-800/80 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400/50 dark:focus:bg-gray-800 dark:focus:shadow-blue-500/5"
        />
        {/* Clear button or loading indicator */}
        {isLoading ? (
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            <svg className="size-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : !isQueryEmpty ? (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        ) : null}
      </div>

      {showDropdown && (
        <div className="animate-slide-down absolute top-full right-0 left-0 z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/90">
          {isQueryEmpty && recentSearches.length > 0 && (
            <div className="border-b border-gray-200/50 p-3 dark:border-gray-700/50">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Recent searches</p>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleRecentClick(term)}
                    className="rounded-full bg-gray-100/80 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200/80 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          <SearchResults onClose={closeDropdown} />
        </div>
      )}
    </div>
  )
}
