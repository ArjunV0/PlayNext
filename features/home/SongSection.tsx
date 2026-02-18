import type { Song } from "features/player/PlayerContext"
import { SongCard } from "./SongCard"

interface SongSectionProps {
  title: string
  songs: Song[]
  isLoading: boolean
  onSongClick: (song: Song, queue: Song[]) => void
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
      <div className="aspect-square w-full rounded-lg bg-gray-200 animate-shimmer dark:bg-gray-700" />
      <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 animate-shimmer dark:bg-gray-700" />
      <div className="mt-1 h-3 w-1/2 rounded bg-gray-200 animate-shimmer dark:bg-gray-700" />
    </div>
  )
}

export function SongSection({ title, songs, isLoading, onSongClick }: SongSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="grid min-h-[160px] grid-cols-2 gap-2 sm:min-h-[200px] sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : songs.length > 0
            ? songs.map((song) => <SongCard key={song.id} song={song} onClick={(s) => onSongClick(s, songs)} />)
            : (
              <div className="col-span-full flex min-h-[160px] items-center justify-center sm:min-h-[200px]">
                <p className="text-sm text-gray-400 dark:text-gray-500">No songs found</p>
              </div>
            )}
      </div>
    </section>
  )
}
