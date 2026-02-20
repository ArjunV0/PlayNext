"use client"

import { useContext } from "react"

import { PlaylistContext, type PlaylistContextValue } from "./PlaylistContext"

export function usePlaylist(): PlaylistContextValue {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider")
  }
  return context
}
