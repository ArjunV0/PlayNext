"use client"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"

import { supabase } from "lib/supabase"
import type { Playlist, PlaylistSong, Song } from "lib/types"

export type CreatePlaylistResult =
  | { playlist: Playlist; errorCode: null }
  | { playlist: null; errorCode: "duplicate" | "unknown" }

interface PlaylistContextValue {
  playlists: Playlist[]
  isLoading: boolean
  createPlaylist: (name: string) => Promise<CreatePlaylistResult>
  deletePlaylist: (id: string) => Promise<void>
  getPlaylistSongs: (playlistId: string) => Promise<PlaylistSong[]>
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<{ added: boolean; alreadyExists: boolean }>
  removeSongFromPlaylist: (playlistSongId: string) => Promise<void>
}

export type { PlaylistContextValue }

export const PlaylistContext = createContext<PlaylistContextValue | null>(null)

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const { data } = await supabase.from("playlists").select("*").order("created_at", { ascending: false })
        if (data) {
          setPlaylists(data as Playlist[])
        }
      } catch (err) {
        console.error("Failed to fetch playlists:", err)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchPlaylists()
  }, [])

  const createPlaylist = useCallback(async (name: string): Promise<CreatePlaylistResult> => {
    try {
      const { data, error } = await supabase.from("playlists").insert({ name }).select().single()
      if (error) {
        // PostgreSQL unique_violation code
        if (error.code === "23505") {
          return { playlist: null, errorCode: "duplicate" }
        }
        console.error("Failed to create playlist:", error)
        return { playlist: null, errorCode: "unknown" }
      }
      if (data) {
        const playlist = data as Playlist
        setPlaylists((prev) => [playlist, ...prev])
        return { playlist, errorCode: null }
      }
    } catch (err) {
      console.error("Failed to create playlist:", err)
    }
    return { playlist: null, errorCode: "unknown" }
  }, [])

  const deletePlaylist = useCallback(async (id: string): Promise<void> => {
    try {
      await supabase.from("playlists").delete().eq("id", id)
      setPlaylists((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Playlist operation failed:", err)
    }
  }, [])

  const getPlaylistSongs = useCallback(async (playlistId: string): Promise<PlaylistSong[]> => {
    try {
      const { data } = await supabase
        .from("playlist_songs")
        .select("*")
        .eq("playlist_id", playlistId)
        .order("added_at", { ascending: true })
      if (data) {
        return data as PlaylistSong[]
      }
    } catch (err) {
      console.error("Failed to get playlist songs:", err)
    }
    return []
  }, [])

  const addSongToPlaylist = useCallback(
    async (playlistId: string, song: Song): Promise<{ added: boolean; alreadyExists: boolean }> => {
      try {
        const { data: existing } = await supabase
          .from("playlist_songs")
          .select("id")
          .eq("playlist_id", playlistId)
          .eq("song_id", song.id)
          .maybeSingle()

        if (existing) {
          return { added: false, alreadyExists: true }
        }

        await supabase.from("playlist_songs").insert({
          playlist_id: playlistId,
          song_id: song.id,
          title: song.title,
          artist: song.artist,
          cover_url: song.coverUrl,
          audio_url: song.audioUrl,
        })

        return { added: true, alreadyExists: false }
      } catch {
        return { added: false, alreadyExists: false }
      }
    },
    []
  )

  const removeSongFromPlaylist = useCallback(async (playlistSongId: string): Promise<void> => {
    try {
      await supabase.from("playlist_songs").delete().eq("id", playlistSongId)
    } catch (err) {
      console.error("Playlist operation failed:", err)
    }
  }, [])

  const value = useMemo<PlaylistContextValue>(
    () => ({
      playlists,
      isLoading,
      createPlaylist,
      deletePlaylist,
      getPlaylistSongs,
      addSongToPlaylist,
      removeSongFromPlaylist,
    }),
    [playlists, isLoading, createPlaylist, deletePlaylist, getPlaylistSongs, addSongToPlaylist, removeSongFromPlaylist]
  )

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}
