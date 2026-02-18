"use client"

import { useCallback, useEffect, useState } from "react"

import { fetchSongs } from "features/home/itunes"
import { SECTIONS } from "features/home/sections.constants"
import { SongSection } from "features/home/SongSection"
import { PlayerBar } from "features/player/PlayerBar"
import type { Song } from "features/player/PlayerContext"
import { usePlayer } from "features/player/usePlayer"
import { SearchInput } from "features/search/SearchInput"
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

  const handleSongClick = useCallback((song: Song, queue: Song[]) => {
    playSong(song, queue)
  }, [playSong])

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/60">
        <div className="mx-auto max-w-screen-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="shrink-0 text-lg font-bold text-gradient">PlayNext</h1>
            <div className="hidden flex-1 sm:block">
              <SearchInput />
            </div>
            <div className="flex-1 sm:hidden" />
            <ToggleSwitch />
          </div>
          <div className="mt-2 sm:hidden">
            <SearchInput />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-screen-xl px-4 py-4 pb-24 sm:py-8">
        <SongSection
          title="Selected For You"
          songs={selectedForYou}
          isLoading={isLoading}
          onSongClick={handleSongClick}
        />
        <SongSection title="Top Hits Global" songs={topGlobal} isLoading={isLoading} onSongClick={handleSongClick} />
        <SongSection title="Top Hits India" songs={topIndia} isLoading={isLoading} onSongClick={handleSongClick} />
      </main>
      <PlayerBar />
    </>
  )
}
