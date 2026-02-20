"use client"

import { createContext, useCallback, useMemo, useRef, useState } from "react"

import type { Song } from "lib/types"

interface PlayerContextValue {
  currentSong: Song | null
  upNext: Song[]
  manualQueueCount: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isAutoPlay: boolean
  isQueueOpen: boolean
  isShuffle: boolean
  playSong: (song: Song, contextSongs: Song[]) => void
  playNext: () => void
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleAutoPlay: () => void
  toggleShuffle: () => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  toggleQueue: () => void
}

export type { PlayerContextValue }

export const PlayerContext = createContext<PlayerContextValue | null>(null)

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j] as T
    result[j] = temp as T
  }
  return result
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
  const [manualQueue, setManualQueue] = useState<Song[]>([])
  const [contextQueue, setContextQueue] = useState<Song[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isAutoPlayRef = useRef(true)
  const isShuffleRef = useRef(false)
  const volumeRef = useRef(1)
  const manualQueueRef = useRef<Song[]>([])
  const contextQueueRef = useRef<Song[]>([])
  const contextSourceRef = useRef<Song[]>([])

  const upNext = useMemo(() => [...manualQueue, ...contextQueue], [manualQueue, contextQueue])

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.ontimeupdate = null
    audioRef.current.onloadedmetadata = null
    audioRef.current.onended = null
    audioRef.current = null
  }, [])

  const startAudio = useCallback(
    (song: Song) => {
      stopAudio()
      const audio = new Audio(song.audioUrl)
      audio.volume = volumeRef.current
      audioRef.current = audio
      setCurrentTime(0)
      setDuration(0)

      attachAudioListeners(audio, setCurrentTime, setDuration)

      audio.onended = () => {
        if (!isAutoPlayRef.current) {
          setIsPlaying(false)
          return
        }
        const manualNext = manualQueueRef.current[0]
        if (manualNext) {
          const rest = manualQueueRef.current.slice(1)
          manualQueueRef.current = rest
          setManualQueue(rest)
          setCurrentSong(manualNext)
          startAudio(manualNext)
          return
        }
        const contextNext = contextQueueRef.current[0]
        if (contextNext) {
          const rest = contextQueueRef.current.slice(1)
          contextQueueRef.current = rest
          setContextQueue(rest)
          setCurrentSong(contextNext)
          startAudio(contextNext)
          return
        }
        const source = contextSourceRef.current
        if (source.length > 0) {
          const loopFirst = source[0] as Song
          const loopRest = isShuffleRef.current ? shuffleArray(source.slice(1)) : source.slice(1)
          contextQueueRef.current = loopRest
          setContextQueue(loopRest)
          startAudio(loopFirst)
          return
        }
        setIsPlaying(false)
      }

      setCurrentSong(song)
      setIsPlaying(true)
      audio.play()
    },
    [stopAudio]
  )

  const playSong = useCallback(
    (song: Song, contextSongs: Song[]) => {
      const songIndex = contextSongs.findIndex((s) => s.id === song.id)
      const remaining = songIndex >= 0 ? contextSongs.slice(songIndex + 1) : []
      const ordered = isShuffleRef.current ? shuffleArray(remaining) : remaining
      contextSourceRef.current = contextSongs
      contextQueueRef.current = ordered
      setContextQueue(ordered)
      startAudio(song)
    },
    [startAudio]
  )

  const playNext = useCallback(() => {
    if (!currentSong) return
    const manualNext = manualQueueRef.current[0]
    if (manualNext) {
      const rest = manualQueueRef.current.slice(1)
      manualQueueRef.current = rest
      setManualQueue(rest)
      startAudio(manualNext)
      return
    }
    const contextNext = contextQueueRef.current[0]
    if (contextNext) {
      const rest = contextQueueRef.current.slice(1)
      contextQueueRef.current = rest
      setContextQueue(rest)
      startAudio(contextNext)
    }
  }, [currentSong, startAudio])

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

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev
      isShuffleRef.current = next
      if (next && contextQueueRef.current.length > 0) {
        const shuffled = shuffleArray(contextQueueRef.current)
        contextQueueRef.current = shuffled
        setContextQueue(shuffled)
      }
      return next
    })
  }, [])

  const addToQueue = useCallback((song: Song) => {
    setManualQueue((prev) => {
      const updated = [...prev, song]
      manualQueueRef.current = updated
      return updated
    })
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    const manualLen = manualQueueRef.current.length
    if (index < manualLen) {
      setManualQueue((prev) => {
        const updated = prev.filter((_, i) => i !== index)
        manualQueueRef.current = updated
        return updated
      })
    } else {
      const contextIndex = index - manualLen
      setContextQueue((prev) => {
        const updated = prev.filter((_, i) => i !== contextIndex)
        contextQueueRef.current = updated
        return updated
      })
    }
  }, [])

  const clearQueue = useCallback(() => {
    manualQueueRef.current = []
    contextQueueRef.current = []
    setManualQueue([])
    setContextQueue([])
  }, [])

  const toggleQueue = useCallback(() => {
    setIsQueueOpen((prev) => !prev)
  }, [])

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentSong,
      upNext,
      manualQueueCount: manualQueue.length,
      isPlaying,
      currentTime,
      duration,
      volume,
      isAutoPlay,
      isQueueOpen,
      isShuffle,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
      toggleShuffle,
      addToQueue,
      removeFromQueue,
      clearQueue,
      toggleQueue,
    }),
    [
      currentSong,
      upNext,
      manualQueue.length,
      isPlaying,
      currentTime,
      duration,
      volume,
      isAutoPlay,
      isQueueOpen,
      isShuffle,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
      toggleShuffle,
      addToQueue,
      removeFromQueue,
      clearQueue,
      toggleQueue,
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
