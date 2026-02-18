"use client"

import { createContext, useCallback, useMemo, useRef, useState } from "react"

type Song = {
  id: string
  title: string
  audioUrl: string
}

interface PlayerContextValue {
  currentSong: Song | null
  queue: Song[]
  isPlaying: boolean
  playSong: (song: Song, newQueue: Song[]) => void
  playNext: () => void
  stop: () => void
}

export type { Song, PlayerContextValue }

export const PlayerContext = createContext<PlayerContextValue | null>(null)

function findNextIndex(queue: Song[], currentId: string): number {
  const currentIndex = queue.findIndex((s) => s.id === currentId)
  return (currentIndex + 1) % queue.length
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.onended = null
    audioRef.current = null
  }, [])

  const startAudio = useCallback(
    (song: Song, songQueue: Song[]) => {
      stopAudio()
      const audio = new Audio(song.audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        if (songQueue.length === 0) {
          setIsPlaying(false)
          return
        }
        const nextIndex = findNextIndex(songQueue, song.id)
        const nextSong = songQueue[nextIndex]
        if (nextSong) {
          setCurrentSong(nextSong)
          startAudio(nextSong, songQueue)
        }
      }

      setCurrentSong(song)
      setIsPlaying(true)
      audio.play()
    },
    [stopAudio]
  )

  const playSong = useCallback(
    (song: Song, newQueue: Song[]) => {
      setQueue(newQueue)
      startAudio(song, newQueue)
    },
    [startAudio]
  )

  const playNext = useCallback(() => {
    if (!currentSong || queue.length === 0) return
    const nextIndex = findNextIndex(queue, currentSong.id)
    const nextSong = queue[nextIndex]
    if (nextSong) {
      startAudio(nextSong, queue)
    }
  }, [currentSong, queue, startAudio])

  const stop = useCallback(() => {
    stopAudio()
    setIsPlaying(false)
  }, [stopAudio])

  const value = useMemo<PlayerContextValue>(
    () => ({ currentSong, queue, isPlaying, playSong, playNext, stop }),
    [currentSong, queue, isPlaying, playSong, playNext, stop]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
