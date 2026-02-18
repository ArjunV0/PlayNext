"use client"

import { useSearch } from "./useSearch"

export function SearchInput() {
  const { query, setQuery, isLoading, recentSearches } = useSearch()
  const isQueryEmpty = query.trim() === ""

  const handleRecentClick = (term: string): void => {
    setQuery(term)
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs or artists..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        {isLoading && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">Loading...</span>
        )}
      </div>
      {isQueryEmpty && recentSearches.length > 0 && (
        <div className="mt-2">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Recent searches</p>
          <div className="flex gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentClick(term)}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
