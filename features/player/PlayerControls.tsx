"use client"

import { useCallback, useEffect } from "react"

import { usePlayer } from "./usePlayer"

const SPACEBAR_KEY = " "

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
    <div className="flex items-center gap-3">
      <button
        onClick={togglePlay}
        className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        onClick={playNext}
        className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        aria-label="Next song"
      >
        Next
      </button>
      <label className="flex items-center gap-1.5">
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
        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
          isAutoPlay
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}
        aria-label={isAutoPlay ? "Disable auto-play" : "Enable auto-play"}
        aria-pressed={isAutoPlay}
      >
        Auto
      </button>
    </div>
  )
}
