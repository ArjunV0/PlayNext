import type { Song } from "features/player/PlayerContext"
import { SongCard } from "./AlbumCard"

interface SongSectionProps {
  title: string
  songs: Song[]
  isLoading: boolean
  onSongClick: (song: Song, queue: Song[]) => void
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
      <div className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

export function SongSection({ title, songs, isLoading, onSongClick }: SongSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
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
