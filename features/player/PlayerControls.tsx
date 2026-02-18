"use client"

import { useCallback, useEffect } from "react"

import { usePlayer } from "./usePlayer"

const SPACEBAR_KEY = " "

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function NextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
    </svg>
  )
}

const controlButton =
  "flex items-center justify-center rounded-full transition-all duration-150 active:scale-95 " +
  "size-9 bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 hover:shadow-md " +
  "dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900 dark:hover:text-blue-300"

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
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <button
        onClick={togglePlay}
        className={controlButton}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
      </button>
      <button
        onClick={playNext}
        className={controlButton}
        aria-label="Next song"
      >
        <NextIcon className="size-5" />
      </button>
      <label className="hidden items-center gap-1.5 sm:flex">
        <span className="text-xs text-gray-500 dark:text-gray-400">Vol</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolumeChange}
          className="h-1 w-20 cursor-pointer accent-blue-500"
          aria-label="Volume"
        />
      </label>
      <button
        onClick={toggleAutoPlay}
        className={`hidden rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 sm:block ${
          isAutoPlay
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        }`}
        aria-label={isAutoPlay ? "Disable auto-play" : "Enable auto-play"}
        aria-pressed={isAutoPlay}
      >
        Auto
      </button>
    </div>
  )
}
