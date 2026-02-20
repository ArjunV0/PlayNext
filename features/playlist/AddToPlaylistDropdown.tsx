"use client"

import { useCallback, useState } from "react"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import type { Song } from "lib/types"

import { useToast } from "features/toast"

import { usePlaylist } from "./usePlaylist"

interface AddToPlaylistDropdownProps {
  song: Song
}

export function AddToPlaylistDropdown({ song }: AddToPlaylistDropdownProps) {
  const { playlists, addSongToPlaylist, createPlaylist } = usePlaylist()
  const { showToast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddToPlaylist = useCallback(
    (playlistId: string, playlistName: string) => {
      showToast(`Added to ${playlistName}`)
      addSongToPlaylist(playlistId, song).then((result) => {
        if (result.alreadyExists) {
          showToast(`Already in ${playlistName}`)
        }
      })
    },
    [addSongToPlaylist, song, showToast]
  )

  const handleCreateAndAdd = useCallback(async () => {
    const trimmed = newPlaylistName.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await createPlaylist(trimmed)
      if (result.playlist) {
        await addSongToPlaylist(result.playlist.id, song)
        showToast(`Added to ${result.playlist.name}`)
        setNewPlaylistName("")
        setIsCreating(false)
      } else if (result.errorCode === "duplicate") {
        showToast("A playlist with this name already exists")
      } else {
        showToast("Failed to create playlist. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [newPlaylistName, isSubmitting, createPlaylist, addSongToPlaylist, song, showToast])

  const handleNewPlaylistKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.key === "Enter") {
        void handleCreateAndAdd()
      }
      if (e.key === "Escape") {
        setIsCreating(false)
        setNewPlaylistName("")
      }
    },
    [handleCreateAndAdd]
  )

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <DropdownMenu.Root
      onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false)
          setNewPlaylistName("")
        }
      }}
    >
      <DropdownMenu.Trigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={handleTriggerClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleTriggerClick(e as unknown as React.MouseEvent)
          }}
          aria-label={`Add ${song.title} to a playlist`}
          className="group/playlist relative flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 focus:outline-none"
        >
          <svg className="size-4 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
          </svg>
          <span className="pointer-events-none absolute right-0 -bottom-8 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/playlist:opacity-100">
            Add to playlist
          </span>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[180px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          sideOffset={6}
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          {playlists.length === 0 && !isCreating && (
            <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">No playlists yet</div>
          )}
          {playlists.map((playlist) => (
            <DropdownMenu.Item
              key={playlist.id}
              className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 outline-none select-none hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              onSelect={(e) => {
                e.preventDefault()
                void handleAddToPlaylist(playlist.id, playlist.name)
              }}
            >
              {playlist.name}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {isCreating ? (
            <div className="flex items-center gap-1 px-2 py-1" onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={handleNewPlaylistKeyDown}
                placeholder="Playlist name"
                className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-violet-500"
              />
              <button
                onClick={() => void handleCreateAndAdd()}
                disabled={!newPlaylistName.trim() || isSubmitting}
                className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-700"
              >
                Create
              </button>
            </div>
          ) : (
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm text-blue-600 outline-none select-none hover:bg-gray-100 focus:bg-gray-100 dark:text-violet-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
              onSelect={(e) => {
                e.preventDefault()
                setIsCreating(true)
              }}
            >
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              New Playlist
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
