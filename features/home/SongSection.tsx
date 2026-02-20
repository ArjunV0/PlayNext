"use client"

import type { Song } from "lib/types"
import { SongCard } from "./SongCard"

interface SongSectionProps {
  title: string
  songs: Song[]
  isLoading: boolean
  onSongClick: (song: Song, queue: Song[]) => void
  sentinelRef?: React.RefCallback<HTMLDivElement>
  isLoadingMore?: boolean
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
      <div className="animate-shimmer aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="animate-shimmer mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="animate-shimmer mt-1 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
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

export function SongSection({ title, songs, isLoading, onSongClick, sentinelRef, isLoadingMore }: SongSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="grid min-h-[160px] grid-cols-2 gap-2 sm:min-h-[200px] sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {isLoading ? (
          Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
        ) : songs.length > 0 ? (
          songs.map((song) => <SongCard key={song.id} song={song} onClick={(s) => onSongClick(s, songs)} />)
        ) : (
          <div className="col-span-full flex min-h-[160px] items-center justify-center sm:min-h-[200px]">
            <p className="text-sm text-gray-400 dark:text-gray-500">No songs found</p>
          </div>
        )}
      </div>
      {sentinelRef && <div ref={sentinelRef} className="h-1" />}
      {isLoadingMore && <LoadingSpinner />}
    </section>
  )
}
