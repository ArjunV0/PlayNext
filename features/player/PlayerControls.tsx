"use client"

import { useCallback, useEffect } from "react"

import { usePlayer } from "./usePlayer"

const SPACEBAR_KEY = " "

function PlayIcon() {
  return (
    <svg className="ml-0.5 size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
    </svg>
  )
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) {
    return (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.5 12A4.5 4.5 0 0 0 14 8.05v1.59l2.45 2.45c.03-.17.05-.34.05-.52zm2 0c0 .94-.2 1.82-.54 2.64l1.17 1.17A8.46 8.46 0 0 0 20 12c0-4.28-3.05-7.86-7.1-8.73v2.1A6.5 6.5 0 0 1 18.5 12zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.1a8.46 8.46 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    )
  }
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.05v7.95a4.5 4.5 0 0 0 2.5-3.95zM14 3.23v2.06A6.5 6.5 0 0 1 18.5 12 6.5 6.5 0 0 1 14 18.71v2.06C17.89 20.14 21 16.28 21 12s-3.11-8.14-7-8.77z" />
    </svg>
  )
}

function RepeatIcon() {
  return (
    <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
  )
}

export function PlayerControls() {
  const { isPlaying, volume, isAutoPlay, togglePlay, playNext, setVolume, toggleAutoPlay } = usePlayer()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== SPACEBAR_KEY) return
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return
      e.preventDefault()
      togglePlay()
    },
    [togglePlay]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(Number(e.target.value))
    },
    [setVolume]
  )

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="flex size-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-110"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* Next */}
      <button
        onClick={playNext}
        className="flex size-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Next song"
      >
        <NextIcon />
      </button>

      {/* Volume */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <button
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label={volume === 0 ? "Unmute" : "Mute"}
        >
          <VolumeIcon volume={volume} />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolumeChange}
          className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-500 dark:bg-gray-700 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-sm"
          aria-label="Volume"
        />
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={toggleAutoPlay}
        className={`hidden items-center justify-center rounded-full p-1.5 transition-all sm:flex ${
          isAutoPlay
            ? "bg-blue-100 text-blue-600 shadow-sm shadow-blue-500/10 dark:bg-blue-900/50 dark:text-blue-400"
            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        }`}
        aria-label={isAutoPlay ? "Disable auto-play" : "Enable auto-play"}
        aria-pressed={isAutoPlay}
      >
        <RepeatIcon />
      </button>
    </div>
  )
}
