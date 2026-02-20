"use client"

import { useCallback, useEffect, useState } from "react"

import { fetchSongs } from "features/home/itunes"
import { SECTIONS } from "features/home/sections.constants"
import { SongSection } from "features/home/SongSection"
import { usePlayer } from "features/player/usePlayer"
import type { Song } from "lib/types"

export default function HomePage() {
  const { playSong } = usePlayer()
  const [selectedForYou, setSelectedForYou] = useState<Song[]>([])
  const [topGlobal, setTopGlobal] = useState<Song[]>([])
  const [topIndia, setTopIndia] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSongs() {
      try {
        const [sfy, tg, ti] = await Promise.all([
          fetchSongs(SECTIONS.SELECTED_FOR_YOU, 6, controller.signal),
          fetchSongs(SECTIONS.TOP_HITS_GLOBAL, 6, controller.signal),
          fetchSongs(SECTIONS.TOP_HITS_INDIA, 6, controller.signal),
        ])
        setSelectedForYou(sfy)
        setTopGlobal(tg)
        setTopIndia(ti)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
        throw e
      } finally {
        setIsLoading(false)
      }
    }
    loadSongs()

    return () => controller.abort()
  }, [])

  const handleSongClick = useCallback(
    (song: Song, queue: Song[]) => {
      playSong(song, queue)
    },
    [playSong]
  )

  return (
    <>
      <SongSection
        title="Selected For You"
        songs={selectedForYou}
        isLoading={isLoading}
        onSongClick={handleSongClick}
      />
      <SongSection title="Top Hits Global" songs={topGlobal} isLoading={isLoading} onSongClick={handleSongClick} />
      <SongSection title="Top Hits India" songs={topIndia} isLoading={isLoading} onSongClick={handleSongClick} />
    </>
  )
}
