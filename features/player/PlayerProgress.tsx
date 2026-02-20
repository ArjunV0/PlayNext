"use client"

import { useCallback, useRef } from "react"

import { formatDuration } from "lib/format"

import { usePlayer } from "./usePlayer"

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
        {formatDuration(currentTime)}
      </span>
      <div
        ref={barRef}
        role="progressbar"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemax={Math.round(duration)}
        onClick={handleSeek}
        className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-gray-200 transition-all hover:h-2.5 dark:bg-gray-700"
      >
        {/* Gradient filled portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
          style={{ width: `${progress}%` }}
        />
        {/* Thumb dot — visible on hover */}
        <div
          className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md ring-2 ring-blue-500 transition-opacity group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 7px)` }}
        />
      </div>
      <span className="w-10 text-xs text-gray-500 tabular-nums dark:text-gray-400">{formatDuration(duration)}</span>
    </div>
  )
}
