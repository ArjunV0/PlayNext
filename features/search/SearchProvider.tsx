"use client"

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { Song } from "./types"
import { DEBOUNCE_DELAY_MS, MAX_RECENT_SEARCHES, RECENT_SEARCHES_KEY } from "./types"

export interface SearchContextValue {
  query: string
  results: Song[]
  isLoading: boolean
  recentSearches: string[]
  setQuery: (query: string) => void
  clearResults: () => void
}

export const SearchContext = createContext<SearchContextValue | null>(null)

function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
  if (!stored) return []
  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed)) return []
  return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT_SEARCHES)
}

function saveRecentSearch(term: string, existing: string[]): string[] {
  const filtered = existing.filter((s) => s !== term)
  const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  return updated
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResults = useCallback(() => {
    setResults([])
    setQuery("")
  }, [])

  const value = useMemo(
    () => ({ query, results, isLoading, recentSearches, setQuery, clearResults }),
    [query, results, isLoading, recentSearches, clearResults]
  )

  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(async () => {
      const params = new URLSearchParams({ q: trimmed })
      const response = await fetch(`/api/search?${params.toString()}`)
      const data = (await response.json()) as { results: Song[] }
      setResults(data.results)
      setIsLoading(false)
      setRecentSearches((prev) => saveRecentSearch(trimmed, prev))
    }, DEBOUNCE_DELAY_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
