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
  isRepeat: boolean
  isQueueOpen: boolean
  isShuffle: boolean
  playSong: (song: Song, contextSongs: Song[]) => void
  playNext: () => void
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleAutoPlay: () => void
  toggleRepeat: () => void
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
  // contextQueue holds ALL songs from the current context (stable, index-based)
  const [contextQueue, setContextQueue] = useState<Song[]>([])
  const [contextIndex, setContextIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined)
  const isAutoPlayRef = useRef(true)
  const isRepeatRef = useRef(false)
  const isShuffleRef = useRef(false)
  const volumeRef = useRef(1)
  const manualQueueRef = useRef<Song[]>([])
  const contextQueueRef = useRef<Song[]>([])
  const contextIndexRef = useRef(-1)
  const contextSourceRef = useRef<Song[]>([])

  // upNext shows manual queue items first, then upcoming context songs (after current index)
  const upNext = useMemo(
    () => [...manualQueue, ...contextQueue.slice(contextIndex + 1)],
    [manualQueue, contextQueue, contextIndex]
  )

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    audio.ontimeupdate = null
    audio.onloadedmetadata = null
    audio.onended = null
    audioRef.current = null
    const pending = playPromiseRef.current
    playPromiseRef.current = undefined
    if (pending) {
      pending.then(() => audio.pause()).catch(() => {})
    } else {
      audio.pause()
    }
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
        // Repeat: replay the current song
        if (isRepeatRef.current) {
          startAudio(song)
          return
        }

        if (!isAutoPlayRef.current) {
          setIsPlaying(false)
          return
        }

        // Manual queue takes priority
        const manualNext = manualQueueRef.current[0]
        if (manualNext) {
          const rest = manualQueueRef.current.slice(1)
          manualQueueRef.current = rest
          setManualQueue(rest)
          startAudio(manualNext)
          return
        }

        // Advance context index
        const nextIndex = contextIndexRef.current + 1
        const contextSongs = contextQueueRef.current
        if (nextIndex < contextSongs.length) {
          contextIndexRef.current = nextIndex
          setContextIndex(nextIndex)
          const nextSong = contextSongs[nextIndex] as Song
          startAudio(nextSong)
          return
        }

        // Exhausted context queue — loop from beginning via source
        const source = contextSourceRef.current
        if (source.length > 0) {
          const ordered = isShuffleRef.current ? shuffleArray(source) : source
          contextQueueRef.current = ordered
          setContextQueue(ordered)
          contextIndexRef.current = 0
          setContextIndex(0)
          startAudio(ordered[0] as Song)
          return
        }

        setIsPlaying(false)
      }

      setCurrentSong(song)
      setIsPlaying(true)
      playPromiseRef.current = audio.play().catch(() => {})
    },
    [stopAudio]
  )

  const playSong = useCallback(
    (song: Song, contextSongs: Song[]) => {
      const songIndex = contextSongs.findIndex((s) => s.id === song.id)
      // Store the full ordered list (shuffle applies to the full set)
      const ordered = isShuffleRef.current ? shuffleArray(contextSongs) : contextSongs
      const playIndex = isShuffleRef.current ? ordered.findIndex((s) => s.id === song.id) : Math.max(0, songIndex)
      contextSourceRef.current = contextSongs
      contextQueueRef.current = ordered
      contextIndexRef.current = playIndex
      setContextQueue(ordered)
      setContextIndex(playIndex)
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
    const nextIndex = contextIndexRef.current + 1
    const contextSongs = contextQueueRef.current
    if (nextIndex < contextSongs.length) {
      contextIndexRef.current = nextIndex
      setContextIndex(nextIndex)
      startAudio(contextSongs[nextIndex] as Song)
    }
  }, [currentSong, startAudio])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      const pending = playPromiseRef.current
      playPromiseRef.current = undefined
      if (pending) {
        pending.then(() => audioRef.current?.pause()).catch(() => {})
      } else {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      playPromiseRef.current = audioRef.current.play().catch(() => {})
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

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => {
      isRepeatRef.current = !prev
      return !prev
    })
  }, [])

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev
      isShuffleRef.current = next
      if (contextQueueRef.current.length > 0) {
        if (next) {
          // Shuffle: keep current song at contextIndex, shuffle the rest around it
          const current = contextQueueRef.current[contextIndexRef.current]
          const before = contextQueueRef.current.slice(0, contextIndexRef.current)
          const after = contextQueueRef.current.slice(contextIndexRef.current + 1)
          const shuffledAfter = shuffleArray(after)
          const shuffled = [...before, ...(current ? [current] : []), ...shuffledAfter]
          contextQueueRef.current = shuffled
          setContextQueue(shuffled)
        } else {
          // Un-shuffle: restore original source order, find current song's new position
          const source = contextSourceRef.current
          if (source.length > 0) {
            const currentSongInQueue = contextQueueRef.current[contextIndexRef.current]
            contextQueueRef.current = source
            setContextQueue(source)
            if (currentSongInQueue) {
              const newIndex = source.findIndex((s) => s.id === currentSongInQueue.id)
              if (newIndex >= 0) {
                contextIndexRef.current = newIndex
                setContextIndex(newIndex)
              }
            }
          }
        }
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
      // upNext shows contextQueue.slice(contextIndexRef.current + 1), so offset by that
      const offsetInContext = index - manualLen + contextIndexRef.current + 1
      setContextQueue((prev) => {
        const updated = prev.filter((_, i) => i !== offsetInContext)
        contextQueueRef.current = updated
        return updated
      })
    }
  }, [])

  const clearQueue = useCallback(() => {
    manualQueueRef.current = []
    contextQueueRef.current = []
    contextIndexRef.current = -1
    contextSourceRef.current = []
    setManualQueue([])
    setContextQueue([])
    setContextIndex(-1)
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
      isRepeat,
      isQueueOpen,
      isShuffle,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
      toggleRepeat,
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
      isRepeat,
      isQueueOpen,
      isShuffle,
      playSong,
      playNext,
      togglePlay,
      stop,
      seek,
      setVolume,
      toggleAutoPlay,
      toggleRepeat,
      toggleShuffle,
      addToQueue,
      removeFromQueue,
      clearQueue,
      toggleQueue,
    ]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
