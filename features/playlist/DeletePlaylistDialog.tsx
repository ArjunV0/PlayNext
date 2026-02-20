"use client"

import { useRouter } from "next/navigation"

import * as Dialog from "@radix-ui/react-dialog"

import type { Playlist } from "lib/types"

import { usePlaylist } from "./usePlaylist"

interface DeletePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playlist: Playlist | null
}

export function DeletePlaylistDialog({ open, onOpenChange, playlist }: DeletePlaylistDialogProps) {
  const { deletePlaylist } = usePlaylist()
  const router = useRouter()

  const handleDelete = async () => {
    if (!playlist) return
    await deletePlaylist(playlist.id)
    onOpenChange(false)
    router.push("/")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          aria-describedby="delete-playlist-description"
        >
          <Dialog.Title className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Delete &quot;{playlist?.name}&quot;?
          </Dialog.Title>

          <p id="delete-playlist-description" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            This can&apos;t be undone.
          </p>

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
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
