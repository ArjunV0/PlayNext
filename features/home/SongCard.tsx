"use client"

import type { Song } from "lib/types"

import { usePlayer } from "features/player/usePlayer"

import { useToast } from "features/toast"

interface SongCardProps {
  song: Song
  onClick: (song: Song) => void
}

export function SongCard({ song, onClick }: SongCardProps) {
  const { currentSong, isPlaying, addToQueue } = usePlayer()
  const { showToast } = useToast()
  const isActive = currentSong?.id === song.id
  const showPause = isActive && isPlaying

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToQueue(song)
    showToast("Added to queue")
  }

  return (
    <button
      onClick={() => onClick(song)}
      className={`group w-full rounded-xl p-2 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-xl sm:p-3 ${
        isActive
          ? "bg-white shadow-lg ring-1 ring-blue-500/30 dark:bg-gray-800 dark:ring-violet-500/30"
          : "bg-gray-50/80 hover:bg-white hover:ring-1 hover:ring-blue-500/20 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:hover:shadow-violet-500/5 dark:hover:ring-violet-500/20"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isActive ? "bg-black/30" : "bg-black/0 group-hover:bg-black/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`group/play relative flex size-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/30 ${
                isActive
                  ? "scale-100 bg-white/30 opacity-100"
                  : "scale-75 bg-white/20 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              }`}
            >
              {showPause ? (
                <svg className="size-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="ml-0.5 size-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/play:opacity-100">
                {showPause ? "Pause" : "Play"}
              </span>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={handleAddToQueue}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  addToQueue(song)
                  showToast("Added to queue")
                }
              }}
              className={`group/queue relative flex size-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/30 ${
                isActive
                  ? "scale-100 bg-white/30 opacity-100"
                  : "scale-75 bg-white/20 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              }`}
              aria-label={`Add ${song.title} to queue`}
            >
              <svg className="size-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/queue:opacity-100">
                Add to queue
              </span>
            </div>
            <div
          </div>
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
    </button>
  )
}
