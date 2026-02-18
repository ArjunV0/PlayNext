"use client"

import { useEffect, useState } from "react"

import type { Song as SearchSong } from "./types"
import { useSearch } from "./useSearch"
import { usePlayer } from "features/player/usePlayer"
import type { Song } from "features/player/PlayerContext"

interface SearchSongWithAudio extends SearchSong {
  audioUrl?: string
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function SongItem({ song, onSelect }: { song: SearchSongWithAudio; onSelect: (song: SearchSongWithAudio) => void }) {
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
      {song.duration > 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDuration(song.duration)}</span>
      )}
    </button>
  )
}

export function SearchResults({ onClose }: { onClose?: () => void }) {
  const { query, results, isLoading } = useSearch()
  const { playSong } = usePlayer()
  const [recommended, setRecommended] = useState<SearchSongWithAudio[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRecommended() {
      try {
        const params = new URLSearchParams({ q: "top hits" })
        const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
        const data = (await response.json()) as { results: SearchSongWithAudio[] }
        setRecommended(data.results.slice(0, 3))
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
      }
    }
    loadRecommended()

    return () => controller.abort()
  }, [])

  const isQueryEmpty = query.trim() === ""
  const hasNoResults = !isLoading && !isQueryEmpty && results.length === 0

  const handleSelect = (song: SearchSongWithAudio): void => {
    if (!song.audioUrl) return
    const playerSong: Song = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
    }
    const allSongs: Song[] = (isQueryEmpty ? recommended : (results as SearchSongWithAudio[]))
      .filter((s) => s.audioUrl)
      .map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        coverUrl: s.coverUrl,
        audioUrl: s.audioUrl!,
      }))
    playSong(playerSong, allSongs)
    onClose?.()
  }

  if (isQueryEmpty) {
    if (recommended.length === 0) return null
    return (
      <div className="p-2">
        <p className="mb-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recommended</p>
        <div className="space-y-0.5">
          {recommended.map((song) => (
            <SongItem key={song.id} song={song} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <p className="py-6 text-center text-sm text-gray-400">Searching...</p>
  }

  if (hasNoResults) {
    return (
      <div className="p-2">
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">No results found</p>
        {recommended.length > 0 && (
          <>
            <p className="mb-2 px-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recommended</p>
            <div className="space-y-0.5">
              {recommended.map((song) => (
                <SongItem key={song.id} song={song} onSelect={handleSelect} />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-0.5 p-2">
      {(results as SearchSongWithAudio[]).map((song) => (
        <SongItem key={song.id} song={song} onSelect={handleSelect} />
      ))}
    </div>
  )
}
