import { AlbumCard } from "./AlbumCard"
import type { Album } from "./albums.constants"

interface AlbumSectionProps {
  title: string
  albums: Album[]
  onAlbumClick: (album: Album) => void
}

export function AlbumSection({ title, albums, onAlbumClick }: AlbumSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} onClick={onAlbumClick} />
        ))}
      </div>
    </section>
  )
}
