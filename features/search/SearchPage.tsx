"use client"

import { useCallback } from "react"

import { useRouter } from "next/navigation"

import type { Song } from "lib/types"
import { useInfiniteScroll } from "lib/useInfiniteScroll"

import { usePlayer } from "features/player/usePlayer"

import { NoResultsState } from "./NoResultsState"
import { PreSearchState } from "./PreSearchState"
import { SearchResultRow } from "./SearchResultRow"
import { TopResultBanner } from "./TopResultBanner"
import { useSearch } from "./useSearch"

const NEXT_QUEUE_SIZE = 3
const SEARCH_PAGE_SIZE = 10

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <div className="size-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <svg className="size-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export function SearchPage() {
  const { query, results, isLoading, totalCount, recentSearches, setQuery, removeRecentSearch, clearRecentSearches } =
    useSearch()
  const { playSong, addToQueue } = usePlayer()
  const router = useRouter()

  const trimmedQuery = query.trim()

  const fetchSearchPage = useCallback(
    async (offset: number) => {
      const params = new URLSearchParams({
        q: trimmedQuery,
        limit: String(SEARCH_PAGE_SIZE),
        offset: String(offset),
      })
      const response = await fetch(`/api/search?${params.toString()}`)
      const data = (await response.json()) as { results: Song[]; totalCount: number }
      return {
        items: data.results,
        hasMore: data.results.length === SEARCH_PAGE_SIZE,
      }
    },
    [trimmedQuery]
  )

  const {
    items: allResults,
    sentinelRef,
    isLoadingMore,
  } = useInfiniteScroll({
    fetchPage: fetchSearchPage,
    initialItems: results,
    enabled: trimmedQuery !== "" && !isLoading,
  })

  const handlePlay = useCallback(
    (song: Song) => {
      const songIndex = allResults.findIndex((s) => s.id === song.id)
      const nextSongs = songIndex >= 0 ? allResults.slice(songIndex, songIndex + 1 + NEXT_QUEUE_SIZE) : [song]
      playSong(song, nextSongs)
    },
    [allResults, playSong]
  )

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song)
    },
    [addToQueue]
  )

  const handleRecentClick = useCallback(
    (term: string) => {
      setQuery(term)
      router.push(`/search?q=${encodeURIComponent(term)}`)
    },
    [setQuery, router]
  )

  if (trimmedQuery === "") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <PreSearchState
          recentSearches={recentSearches}
          onRecentClick={handleRecentClick}
          onRemoveRecent={removeRecentSearch}
          onClearAll={clearRecentSearches}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <LoadingSkeleton />
      </div>
    )
  }

  if (allResults.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <NoResultsState query={query} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {totalCount} results for &apos;{query}&apos;
      </p>

      {allResults.length > 0 && (
        <TopResultBanner song={allResults[0] as Song} onPlay={handlePlay} onAddToQueue={handleAddToQueue} />
      )}

      <div className="mt-4 space-y-0.5">
        {allResults.slice(1).map((song) => (
          <SearchResultRow key={song.id} song={song} onPlay={handlePlay} onAddToQueue={handleAddToQueue} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" />
      {isLoadingMore && <LoadingSpinner />}
    </div>
  )
}
