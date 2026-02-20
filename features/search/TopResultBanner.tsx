"use client"

import type { Song } from "lib/types"

import { AddToPlaylistDropdown } from "features/playlist/AddToPlaylistDropdown"
import { useToast } from "features/toast"

interface TopResultBannerProps {
  song: Song
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
}

export function TopResultBanner({ song, onPlay, onAddToQueue }: TopResultBannerProps) {
  const { showToast } = useToast()

  const handleBannerClick = () => {
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
      onClick={handleBannerClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleBannerClick()
      }}
      className="group relative h-48 w-full cursor-pointer overflow-hidden rounded-xl sm:h-56"
    >
      {/* Blurred background image */}
      <img
        src={song.coverUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

      {/* Content */}
      <div className="relative flex h-full items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-5">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="size-24 shrink-0 rounded-lg object-cover shadow-lg sm:size-32"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wider text-white/60 uppercase">Top Result</p>
            <h2 className="mt-1 truncate text-2xl font-bold text-white">{song.title}</h2>
            <p className="mt-0.5 truncate text-lg text-white/80">{song.artist}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPlay(song)
            }}
            aria-label={`Play ${song.title}`}
            className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all duration-300 hover:bg-white/30"
          >
            <svg className="size-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleQueueClick}
            aria-label={`Add ${song.title} to queue`}
            className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all duration-300 hover:bg-white/30"
          >
            <svg className="size-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            <AddToPlaylistDropdown song={song} />
          </div>
        </div>
      </div>
    </div>
  )
}
