"use client"

import { useEffect, useRef, useState } from "react"

import { Tooltip } from "components/Tooltip/Tooltip"

import { PlayerControls } from "./PlayerControls"
import { PlayerProgress } from "./PlayerProgress"
import { usePlayer } from "./usePlayer"

const TOOLTIP_CLASS =
  "glass-toast border border-white/20 text-gray-900 dark:text-white px-2.5 py-1.5 text-[11px] font-medium rounded-lg shadow-lg"

function QueueToggleIcon() {
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
    </svg>
  )
}

function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [duration, setDuration] = useState("10s")

  useEffect(() => {
    const container = containerRef.current
    const textEl = textRef.current
    if (!container || !textEl) return
    const isOver = textEl.scrollWidth > container.clientWidth
    setIsOverflowing(isOver)
    if (isOver) {
      const seconds = textEl.scrollWidth / 30
      setDuration(`${seconds}s`)
    }
  }, [text])

  if (!isOverflowing) {
    return (
      <span ref={containerRef} className={`block overflow-hidden ${className ?? ""}`}>
        <span ref={textRef} className="block truncate">
          {text}
        </span>
      </span>
    )
  }

  return (
    <span ref={containerRef} className={`block overflow-hidden ${className ?? ""}`}>
      <span
        className="animate-marquee inline-flex whitespace-nowrap"
        style={{ "--marquee-duration": duration, "--marquee-delay": "2s" } as React.CSSProperties}
      >
        <span ref={textRef} className="pr-8">
          {text}
        </span>
        <span className="pr-8" aria-hidden="true">
          {text}
        </span>
      </span>
    </span>
  )
}

export function PlayerBar() {
  const { currentSong, isPlaying, upNext, isQueueOpen, toggleQueue } = usePlayer()

  if (!currentSong) return null

  return (
    <div
      data-testid="player-bar"
      className="animate-slide-up fixed right-0 bottom-0 left-0 z-50 bg-white/70 backdrop-blur-xl dark:bg-gray-900/70"
    >
      {/* Animated gradient top border */}
      <div
        className="animate-gradient-shift absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, #818cf8, #c084fc, #f472b6, #818cf8)",
          backgroundSize: "200% 100%",
        }}
        aria-hidden="true"
      />

      {/* Ambient tint overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] transition-all duration-[1200ms] dark:opacity-[0.10]"
        style={{
          background: `radial-gradient(ellipse at 15% 50%, hsl(var(--ambient-h, 271) var(--ambient-s, 81%) var(--ambient-l, 56%)) 0%, transparent 60%)`,
        }}
      />

      <div className="mx-auto max-w-screen-lg px-3 pt-2 pb-3 sm:px-4">
        <PlayerProgress />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Album art with vinyl disk */}
            <div className="relative size-14 shrink-0">
              {/* Vinyl disk */}
              <div
                className={`absolute inset-0 rounded-full ${isPlaying ? "animate-vinyl-spin" : ""}`}
                style={{
                  background: `radial-gradient(circle, transparent 38%, #1a1a2e 39%, #1a1a2e 44%, #16162a 45%, #16162a 48%, #1a1a2e 49%, #1a1a2e 52%, #16162a 53%, #16162a 56%, #1a1a2e 57%, #1a1a2e 100%)`,
                }}
                aria-hidden="true"
              />
              {/* Album art */}
              {currentSong.coverUrl ? (
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="absolute inset-[4px] rounded-lg bg-gray-200 object-cover shadow-sm dark:bg-gray-700"
                />
              ) : (
                <div className="absolute inset-[4px] flex items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  ♪
                </div>
              )}
            </div>

            {/* Song info with marquee */}
            <div className="max-w-[180px] min-w-0 sm:max-w-[240px]">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <MarqueeText text={currentSong.title} />
              </p>
              {currentSong.artist && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <MarqueeText text={currentSong.artist} />
                </p>
              )}
            </div>
          </div>
          <PlayerControls />
          <Tooltip explainer={isQueueOpen ? "Close Queue" : "Queue"} className={TOOLTIP_CLASS}>
            <button
              onClick={toggleQueue}
              className={`relative ml-1 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                isQueueOpen
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              }`}
              aria-label={isQueueOpen ? "Close queue" : "Open queue"}
            >
              <QueueToggleIcon />
              {upNext.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                  {upNext.length > 9 ? "9+" : upNext.length}
                </span>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
