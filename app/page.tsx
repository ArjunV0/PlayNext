"use client"

import { useCallback } from "react"

import type { Album } from "features/home/albums.constants"
import { MADE_FOR_YOU, TOP_HITS_GLOBAL, TOP_HITS_INDIA } from "features/home/albums.constants"
import { AlbumSection } from "features/home/AlbumSection"

export default function HomePage() {
  const handleAlbumClick = useCallback((_album: Album) => {
    // Integration point for PlayerContext or search
  }, [])

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8">
      <AlbumSection title="Made For You" albums={MADE_FOR_YOU} onAlbumClick={handleAlbumClick} />
      <AlbumSection title="Top Hits Global" albums={TOP_HITS_GLOBAL} onAlbumClick={handleAlbumClick} />
      <AlbumSection title="Top Hits India" albums={TOP_HITS_INDIA} onAlbumClick={handleAlbumClick} />
    </main>
  )
}
