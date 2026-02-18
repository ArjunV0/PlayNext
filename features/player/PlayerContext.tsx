"use client"

import { createContext, useCallback, useMemo, useRef, useState } from "react"

type Song = {
  id: string
  title: string
  artist?: string
  coverUrl?: string
  audioUrl: string
}

interface PlayerContextValue {
  currentSong: Song | null
  queue: Song[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isAutoPlay: boolean
  playSong: (song: Song, newQueue: Song[]) => void
  playNext: () => void
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleAutoPlay: () => void
}

export type { Song, PlayerContextValue }

export const PlayerContext = createContext<PlayerContextValue | null>(null)

function findNextIndex(queue: Song[], currentId: string): number {
  const currentIndex = queue.findIndex((s) => s.id === currentId)
  return (currentIndex + 1) % queue.length
}

function attachAudioListeners(
  audio: HTMLAudioElement,
  onTimeUpdate: (time: number) => void,
  onLoadedMetadata: (dur: number) => void
): void {
  audio.ontimeupdate = () => onTimeUpdate(audio.currentTime)
  audio.onloadedmetadata = () => onLoadedMetadata(audio.duration)
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isAutoPlayRef = useRef(true)
  const volumeRef = useRef(1)

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.ontimeupdate = null
    audioRef.current.onloadedmetadata = null
    audioRef.current.onended = null
    audioRef.current = null
  }, [])

  const startAudio = useCallback(
    (song: Song, songQueue: Song[]) => {
      stopAudio()
      const audio = new Audio(song.audioUrl)
      audio.volume = volumeRef.current
      audioRef.current = audio
      setCurrentTime(0)
      setDuration(0)

      attachAudioListeners(audio, setCurrentTime, setDuration)

      audio.onended = () => {
        if (!isAutoPlayRef.current || songQueue.length === 0) {
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

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const stop = useCallback(() => {
    stopAudio()
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [stopAudio])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((vol: number) => {
    volumeRef.current = vol
    setVolumeState(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }, [])

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prev) => {
      isAutoPlayRef.current = !prev
      return !prev
    })
  }, [])

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentSong,
      queue,
      isPlaying,
      currentTime,
      duration,
      volume,
      isAutoPlay,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
    }),
    [
      currentSong,
      queue,
      isPlaying,
      currentTime,
      duration,
      volume,
      isAutoPlay,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
