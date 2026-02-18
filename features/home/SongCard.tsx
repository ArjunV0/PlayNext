import type { Song } from "features/player/PlayerContext"

interface SongCardProps {
  song: Song
  onClick: (song: Song) => void
}

export function SongCard({ song, onClick }: SongCardProps) {
  return (
    <button
      onClick={() => onClick(song)}
      className="group w-full rounded-xl bg-gray-50/80 p-2 text-left transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-xl hover:ring-1 hover:ring-blue-500/20 sm:p-3 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:hover:ring-violet-500/20 dark:hover:shadow-violet-500/5"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        <img src={song.coverUrl} alt={song.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
            <svg
              className="size-6 text-white drop-shadow-lg ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
    </button>
  )
}
