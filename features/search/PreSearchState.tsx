"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { Song } from "lib/types"
import { useInfiniteScroll } from "lib/useInfiniteScroll"

import { SongCard } from "features/home/SongCard"
import { usePlayer } from "features/player/usePlayer"

const TRENDING_PAGE_SIZE = 12

const GENRES = [
  { name: "Pop", gradient: "from-pink-500 to-rose-400" },
  { name: "Hip-Hop", gradient: "from-amber-500 to-orange-500" },
  { name: "Rock", gradient: "from-red-600 to-red-400" },
  { name: "R&B", gradient: "from-purple-600 to-violet-400" },
  { name: "Electronic", gradient: "from-cyan-500 to-blue-500" },
  { name: "Country", gradient: "from-yellow-500 to-amber-400" },
  { name: "Jazz", gradient: "from-indigo-600 to-blue-400" },
  { name: "Classical", gradient: "from-emerald-600 to-teal-400" },
] as const

interface PreSearchStateProps {
  recentSearches: string[]
  onRecentClick: (term: string) => void
  onRemoveRecent: (term: string) => void
  onClearAll: () => void
}

function TrendingIcon() {
  return (
    <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
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

export function PreSearchState({ recentSearches, onRecentClick, onRemoveRecent, onClearAll }: PreSearchStateProps) {
  const { playSong } = usePlayer()
  const [trending, setTrending] = useState<Song[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [genreResults, setGenreResults] = useState<Song[]>([])
  const [isLoadingGenre, setIsLoadingGenre] = useState(false)
  const genreAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrending() {
      try {
        const params = new URLSearchParams({ q: "top hits", limit: String(TRENDING_PAGE_SIZE) })
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        const data = (await response.json()) as { results: Song[] }
        const seen = new Set<string>()
        setTrending(data.results.filter((s) => !seen.has(s.id) && seen.add(s.id)))
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
      }
    }
    void loadTrending()

    return () => controller.abort()
  }, [])

  const fetchTrendingPage = useCallback(async (offset: number) => {
    const params = new URLSearchParams({
      q: "top hits",
      limit: String(TRENDING_PAGE_SIZE),
      offset: String(offset),
    })
    const response = await fetch(`/api/search?${params.toString()}`)
    const data = (await response.json()) as { results: Song[]; totalCount: number }
    return {
      items: data.results,
      hasMore: data.results.length === TRENDING_PAGE_SIZE,
    }
  }, [])

  const {
    items: allTrending,
    sentinelRef,
    isLoadingMore,
  } = useInfiniteScroll({
    fetchPage: fetchTrendingPage,
    initialItems: trending,
    enabled: trending.length > 0,
  })

  const uniqueTrending = useMemo(() => {
    const seen = new Set<string>()
    return allTrending.filter((s) => !seen.has(s.id) && seen.add(s.id))
  }, [allTrending])

  const handleTrendingPlay = (song: Song) => {
    playSong(song, uniqueTrending)
  }

  const handleGenreClick = async (genreName: string) => {
    if (selectedGenre === genreName) {
      setSelectedGenre(null)
      setGenreResults([])
      return
    }

    // Cancel any in-flight genre fetch
    if (genreAbortRef.current) {
      genreAbortRef.current.abort()
    }
    const controller = new AbortController()
    genreAbortRef.current = controller

    setSelectedGenre(genreName)
    setIsLoadingGenre(true)
    setGenreResults([])

    try {
      const params = new URLSearchParams({ q: genreName, limit: "8" })
      const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
      const data = (await response.json()) as { results: Song[] }
      const seen = new Set<string>()
      setGenreResults(data.results.filter((s) => !seen.has(s.id) && seen.add(s.id)))
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return
    } finally {
      setIsLoadingGenre(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent searches</h3>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onRecentClick(term)}
                className="flex items-center gap-1.5 rounded-full bg-gray-100/80 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
              >
                <span>{term}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveRecent(term)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation()
                      onRemoveRecent(term)
                    }
                  }}
                  aria-label={`Remove ${term} from recent searches`}
                  className="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Browse by Genre */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Browse by Genre</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre.name
            return (
              <button
                key={genre.name}
                type="button"
                onClick={() => void handleGenreClick(genre.name)}
                className={`bg-gradient-to-br ${
                  genre.gradient
                } flex h-20 items-end rounded-xl p-3 transition-all duration-200 hover:brightness-110 sm:h-24 ${
                  isSelected ? "scale-[0.97] ring-2 ring-white/60" : ""
                }`}
              >
                <span className="text-sm font-bold text-white drop-shadow">{genre.name}</span>
              </button>
            )
          })}
        </div>

        {/* Genre results */}
        {selectedGenre && (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Showing {selectedGenre}</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedGenre(null)
                  setGenreResults([])
                }}
                aria-label="Close genre results"
                className="flex size-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isLoadingGenre ? (
              <LoadingSpinner />
            ) : genreResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {genreResults.map((song, index) => (
                  <SongCard key={song.id} song={song} index={index} onClick={(s) => playSong(s, genreResults)} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Trending Songs */}
      {uniqueTrending.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-1.5">
            <TrendingIcon />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trending</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {uniqueTrending.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} onClick={handleTrendingPlay} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-1" />
          {isLoadingMore && <LoadingSpinner />}
        </section>
      )}
    </div>
  )
}
