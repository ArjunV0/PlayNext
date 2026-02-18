import type { Album } from "./albums.constants"

interface AlbumCardProps {
  album: Album
  onClick: (album: Album) => void
}

export function AlbumCard({ album, onClick }: AlbumCardProps) {
  return (
    <button
      onClick={() => onClick(album)}
      className="group w-full rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
        <img src={album.coverUrl} alt={album.title} className="size-full object-cover" loading="lazy" />
      </div>
      <p className="mt-2 truncate text-sm font-medium text-gray-900 dark:text-white">{album.title}</p>
      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{album.description}</p>
    </button>
  )
}
