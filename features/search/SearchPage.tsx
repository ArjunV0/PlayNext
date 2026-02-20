"use client"

import { usePlayer } from "features/player/usePlayer"
import type { Song } from "lib/types"

import { useSearch } from "./useSearch"

function SongResult({ song, onSelect }: { song: Song; onSelect: (song: Song) => void }) {
  return (
    <button
      onClick={() => onSelect(song)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
    >
      {song.coverUrl ? (
        <img
          src={song.coverUrl}
          alt={song.title}
          className="size-10 shrink-0 rounded bg-gray-200 object-cover dark:bg-gray-700"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          ♪
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>
    </button>
  )
}

export function SearchPage() {
  const { query, results, isLoading } = useSearch()
  const { playSong } = usePlayer()

  const trimmedQuery = query.trim()

  const handleSelect = (song: Song) => {
    playSong(song, results)
  }

  if (!trimmedQuery) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-400">Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Results for &ldquo;{query}&rdquo;</p>
      <div className="space-y-0.5">
        {results.map((song) => (
          <SongResult key={song.id} song={song} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  )
}
