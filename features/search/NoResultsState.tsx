"use client"

import { useEffect, useState } from "react"

import type { Song } from "lib/types"

import { usePlayer } from "features/player/usePlayer"

interface NoResultsStateProps {
  query: string
}

const RECOMMENDED_LIMIT = 6

export function NoResultsState({ query }: NoResultsStateProps) {
  const { playSong } = usePlayer()
  const [recommended, setRecommended] = useState<Song[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecommended() {
      try {
        const params = new URLSearchParams({
          q: "top hits",
          limit: String(RECOMMENDED_LIMIT),
        })
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        const data = (await response.json()) as { results: Song[] }
        setRecommended(data.results)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
      }
    }
    void loadRecommended()

    return () => controller.abort()
  }, [])

  const handlePlay = (song: Song) => {
    playSong(song, recommended)
  }

  return (
    <div className="flex flex-col items-center">
      {/* No results message */}
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No results for &apos;{query}&apos;</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Try a different search term or check out some recommendations
        </p>
      </div>

      {/* Recommended songs */}
      {recommended.length > 0 && (
        <div className="w-full">
          <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Recommended</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recommended.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => handlePlay(song)}
                className="group text-left transition-transform hover:scale-[1.02]"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
