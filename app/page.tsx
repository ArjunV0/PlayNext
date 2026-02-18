"use client"

import { useEffect, useState } from "react"

import { SECTION_TERMS } from "features/home/albums.constants"
import { SongSection } from "features/home/AlbumSection"
import { fetchSongs } from "features/home/itunes"
import { PlayerBar } from "features/player/PlayerBar"
import type { Song } from "features/player/PlayerContext"
import { usePlayer } from "features/player/usePlayer"
import { SearchInput } from "features/search/SearchInput"
import { SearchResults } from "features/search/SearchResults"
import { ToggleSwitch } from "features/theme/ToggleSwitch"

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
          fetchSongs(SECTION_TERMS.SELECTED_FOR_YOU, 6, controller.signal),
          fetchSongs(SECTION_TERMS.TOP_HITS_GLOBAL, 6, controller.signal),
          fetchSongs(SECTION_TERMS.TOP_HITS_INDIA, 6, controller.signal),
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

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">PlayNext</h1>
          <div className="flex-1">
            <SearchInput />
          </div>
          <ToggleSwitch />
        </div>
      </header>
      <main className="mx-auto max-w-screen-xl px-4 py-8 pb-24">
        <SearchResults />
        <SongSection
          title="Selected For You"
          songs={selectedForYou}
          isLoading={isLoading}
          onSongClick={(song, queue) => playSong(song, queue)}
        />
        <SongSection
          title="Top Hits Global"
          songs={topGlobal}
          isLoading={isLoading}
          onSongClick={(song, queue) => playSong(song, queue)}
        />
        <SongSection
          title="Top Hits India"
          songs={topIndia}
          isLoading={isLoading}
          onSongClick={(song, queue) => playSong(song, queue)}
        />
      </main>
      <PlayerBar />
    </>
  )
}
