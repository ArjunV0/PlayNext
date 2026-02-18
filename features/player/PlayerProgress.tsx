"use client"

import { useCallback, useRef } from "react"

import { usePlayer } from "./usePlayer"

const SECONDS_PER_MINUTE = 60

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE)
  const secs = Math.floor(seconds % SECONDS_PER_MINUTE)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function PlayerProgress() {
  const { currentTime, duration, seek } = usePlayer()
  const barRef = useRef<HTMLDivElement>(null)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!barRef.current || duration === 0) return
      const rect = barRef.current.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      seek(ratio * duration)
    },
    [duration, seek]
  )

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right text-xs text-gray-500 tabular-nums dark:text-gray-400">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        role="progressbar"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemax={Math.round(duration)}
        onClick={handleSeek}
        className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
      </div>
      <span className="w-10 text-xs text-gray-500 tabular-nums dark:text-gray-400">{formatTime(duration)}</span>
    </div>
  )
}
