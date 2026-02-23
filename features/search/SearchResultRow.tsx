"use client"

import { formatDuration } from "lib/format"
import type { Song } from "lib/types"

import { usePlayer } from "features/player/usePlayer"
import { AddToPlaylistDropdown } from "features/playlist/AddToPlaylistDropdown"
import { useToast } from "features/toast"

interface SearchResultRowProps {
  song: Song
  index: number
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
}

const AMBIENT_COLOR = "hsl(var(--ambient-h, 271), var(--ambient-s, 81)%, var(--ambient-l, 56)%)"

export function SearchResultRow({ song, index, onPlay, onAddToQueue }: SearchResultRowProps) {
  const { showToast } = useToast()
  const { currentSong } = usePlayer()
  const isCurrentlyPlaying = currentSong?.id === song.id

  const handleRowClick = () => {
    onPlay(song)
  }

  const handleQueueClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToQueue(song)
    showToast("Added to queue")
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleRowClick()
      }}
      className="animate-stagger-fade-in group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left opacity-0 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
      style={{ animationDelay: `${Math.min(index, 7) * 80}ms` }}
    >
      <div className="relative shrink-0">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="size-12 rounded bg-gray-200 object-cover dark:bg-gray-700"
          loading="lazy"
        />
        {isCurrentlyPlaying && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
            <div className="flex items-end gap-0.5" style={{ color: AMBIENT_COLOR }}>
              <span
                className="h-3 w-0.5 rounded-full bg-current animate-waveform-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-4 w-0.5 rounded-full bg-current animate-waveform-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2.5 w-0.5 rounded-full bg-current animate-waveform-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>

      {/* Duration - visible by default, hidden on hover to make room for actions */}
      {song.duration && song.duration > 0 && (
        <span className="text-xs text-gray-400 group-hover:hidden dark:text-gray-500">
          {formatDuration(song.duration)}
        </span>
      )}

      {/* Hover actions */}
      <div className="hidden items-center gap-1 group-hover:flex">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPlay(song)
          }}
          aria-label={`Play ${song.title}`}
          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleQueueClick}
          aria-label={`Add ${song.title} to queue`}
          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>

        <div onClick={(e) => e.stopPropagation()}>
          <AddToPlaylistDropdown song={song} />
        </div>
      </div>
    </div>
  )
}
