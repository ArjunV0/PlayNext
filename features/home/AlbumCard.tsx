import type { Song } from "features/player/PlayerContext"

interface SongCardProps {
  song: Song
  onClick: (song: Song) => void
}

export function SongCard({ song, onClick }: SongCardProps) {
  return (
    <button
      onClick={() => onClick(song)}
      className="group w-full rounded-lg bg-gray-50 p-3 text-left transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        <img src={song.coverUrl} alt={song.title} className="size-full object-cover" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
          <svg
            className="size-10 text-white opacity-0 drop-shadow-lg transition-opacity duration-200 group-hover:opacity-100"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
    </button>
  )
}
