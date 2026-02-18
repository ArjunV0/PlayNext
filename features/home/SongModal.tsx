"use client"

import { useEffect, useRef } from "react"
import type { Song } from "features/player/PlayerContext"

interface SongModalProps {
  song: Song | null
  onPlay: () => void
  onClose: () => void
}

export function SongModal({ song, onPlay, onClose }: SongModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!song) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [song, onClose])

  if (!song) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Now playing ${song.title}`}
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="aspect-square w-full overflow-hidden rounded-xl">
          <img src={song.coverUrl} alt={song.title} className="size-full object-cover" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">{song.title}</h3>
          <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onPlay}
            className="flex-1 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Play
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
