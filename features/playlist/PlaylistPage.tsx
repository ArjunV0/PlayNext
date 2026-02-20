"use client"

import { usePlaylist } from "./usePlaylist"

interface PlaylistPageProps {
  playlistId: string
}

export function PlaylistPage({ playlistId }: PlaylistPageProps) {
  const { playlists } = usePlaylist()
  const playlist = playlists.find((p) => p.id === playlistId)

  if (!playlist) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Playlist not found</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{playlist.name}</h1>
    </div>
  )
}
