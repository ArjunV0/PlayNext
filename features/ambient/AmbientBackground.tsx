"use client"

import { useEffect, useRef, useState } from "react"

import { usePlayer } from "features/player/usePlayer"
import { extractColor, FALLBACK_HSL } from "lib/colorExtractor"

const GRADIENT_ALPHA_1 = 0.5
const GRADIENT_ALPHA_2 = 0.3

export function AmbientBackground() {
  const [isMounted, setIsMounted] = useState(false)
  const [currentHsl, setCurrentHsl] = useState(FALLBACK_HSL)
  const latestUrlRef = useRef<string>("")
  const { currentSong, isPlaying } = usePlayer()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!currentSong?.coverUrl) {
      setCurrentHsl(FALLBACK_HSL)
      return
    }

    const url = currentSong.coverUrl
    latestUrlRef.current = url

    extractColor(url).then((result) => {
      if (latestUrlRef.current !== url) return
      setCurrentHsl(result)
    })
  }, [currentSong?.coverUrl])

  useEffect(() => {
    if (!isMounted) return

    document.documentElement.style.setProperty("--ambient-h", String(currentHsl.h))
    document.documentElement.style.setProperty("--ambient-s", currentHsl.s + "%")
    document.documentElement.style.setProperty("--ambient-l", currentHsl.l + "%")

    return () => {
      document.documentElement.style.removeProperty("--ambient-h")
      document.documentElement.style.removeProperty("--ambient-s")
      document.documentElement.style.removeProperty("--ambient-l")
    }
  }, [currentHsl, isMounted])

  if (!isMounted) return null

  const isPaused = Boolean(currentSong) && !isPlaying

  return (
    <div
      aria-hidden="true"
      className={`animate-breathe pointer-events-none fixed inset-0 -z-10 ${
        isPaused ? "opacity-[0.08] dark:opacity-[0.12]" : "opacity-[0.12] dark:opacity-[0.20]"
      }`}
      style={{
        background: `radial-gradient(ellipse at 30% 50%, hsla(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%, ${GRADIENT_ALPHA_1}) 0%, transparent 70%), radial-gradient(ellipse at 70% 50%, hsla(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%, ${GRADIENT_ALPHA_2}) 0%, transparent 70%)`,
        transition: "background 1.2s ease-out, opacity 0.8s ease-out",
      }}
    />
  )
}
