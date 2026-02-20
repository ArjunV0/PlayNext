"use client"

import { useSearch } from "./useSearch"

export function SearchPage() {
  const { query } = useSearch()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search</h1>
      {query && <p className="mt-2 text-gray-500 dark:text-gray-400">Results for &ldquo;{query}&rdquo;</p>}
    </div>
  )
}
