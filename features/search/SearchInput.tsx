"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useSearch } from "./useSearch"
import { SearchResults } from "./SearchResults"

export function SearchInput() {
  const { query, setQuery, isLoading, recentSearches } = useSearch()
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

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search songs or artists..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        {isLoading && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">Loading...</span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
          {isQueryEmpty && recentSearches.length > 0 && (
            <div className="border-b border-gray-200/50 p-3 dark:border-gray-700/50">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleRecentClick(term)}
                    className="rounded-md bg-gray-100/80 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200/80 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
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
