"use client"

import { useCallback, useEffect, useState } from "react"

import { fetchSongs } from "features/home/itunes"
import { SECTIONS } from "features/home/sections.constants"
import { SongSection } from "features/home/SongSection"
import { usePlayer } from "features/player/usePlayer"
import type { Song } from "lib/types"
import { useInfiniteScroll } from "lib/useInfiniteScroll"

const DISCOVER_PAGE_SIZE = 12

export default function HomePage() {
  const { playSong } = usePlayer()
  const [selectedForYou, setSelectedForYou] = useState<Song[]>([])
  const [topGlobal, setTopGlobal] = useState<Song[]>([])
  const [topIndia, setTopIndia] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [discoverInitial, setDiscoverInitial] = useState<Song[]>([])

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

  // Load initial discover batch after curated sections finish
  useEffect(() => {
    if (isLoading) return
    const controller = new AbortController()

    async function loadDiscover() {
      try {
        const params = new URLSearchParams({ q: "new music", limit: String(DISCOVER_PAGE_SIZE) })
        const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
        const data = (await response.json()) as { results: Song[] }
        setDiscoverInitial(data.results)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
      }
    }
    void loadDiscover()

    return () => controller.abort()
  }, [isLoading])

  const fetchDiscoverPage = useCallback(async (offset: number) => {
    const params = new URLSearchParams({
      q: "new music",
      limit: String(DISCOVER_PAGE_SIZE),
      offset: String(offset),
    })
    const response = await fetch(`/api/search?${params.toString()}`)
    const data = (await response.json()) as { results: Song[]; totalCount: number }
    return {
      items: data.results,
      hasMore: data.results.length === DISCOVER_PAGE_SIZE,
    }
  }, [])

  const {
    items: discoverSongs,
    sentinelRef: discoverSentinelRef,
    isLoadingMore: discoverLoadingMore,
  } = useInfiniteScroll({
    fetchPage: fetchDiscoverPage,
    initialItems: discoverInitial,
    enabled: discoverInitial.length > 0,
  })

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
      <SongSection
        title="Discover More"
        songs={discoverSongs}
        isLoading={discoverInitial.length === 0 && !isLoading}
        onSongClick={handleSongClick}
        sentinelRef={discoverSentinelRef}
        isLoadingMore={discoverLoadingMore}
      />
    </>
  )
}
