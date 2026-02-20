"use client"

import { useState } from "react"

import * as Dialog from "@radix-ui/react-dialog"

import { usePlaylist } from "./usePlaylist"

interface CreatePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
  const { createPlaylist } = usePlaylist()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setError("")
    setIsSubmitting(true)
    const result = await createPlaylist(trimmed)
    setIsSubmitting(false)

    if (result.playlist) {
      setName("")
      setError("")
      onOpenChange(false)
    } else if (result.errorCode === "duplicate") {
      setError("A playlist with this name already exists")
    } else {
      setError("Failed to create playlist. Please try again.")
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setName("")
      setError("")
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          aria-describedby={undefined}
        >
          <Dialog.Title className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">New Playlist</Dialog.Title>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Playlist name"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-violet-400"
                autoFocus
                maxLength={100}
              />
              {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
