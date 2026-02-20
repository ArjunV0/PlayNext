"use client"

import { usePlayer } from "features/player/usePlayer"
import type { Song } from "lib/types"

function QueueIcon() {
  return (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function QueueItem({
  song,
  index,
  isManual,
  onRemove,
}: {
  song: Song
  index: number
  isManual: boolean
  onRemove: (index: number) => void
}) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/60">
      <img
        src={song.coverUrl}
        alt={song.title}
        className="size-10 shrink-0 rounded bg-gray-200 object-cover dark:bg-gray-700"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
          {isManual && (
            <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              Added
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        aria-label={`Remove ${song.title} from queue`}
      >
        <RemoveIcon />
      </button>
    </div>
  )
}

export function QueuePanel() {
  const { upNext, manualQueueCount, isQueueOpen, toggleQueue, removeFromQueue, clearQueue } = usePlayer()

  return (
    <>
      {isQueueOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity sm:hidden"
          onClick={toggleQueue}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-l border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out dark:border-gray-700/50 dark:bg-gray-900/90 ${
          isQueueOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingBottom: "5rem" }}
      >
        <div className="flex items-center justify-between border-b border-gray-200/50 px-4 py-3 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <QueueIcon />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Up Next</h2>
            {upNext.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {upNext.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {upNext.length > 0 && (
              <button
                onClick={clearQueue}
                className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                Clear all
              </button>
            )}
            <button
              onClick={toggleQueue}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Close queue"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {upNext.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <QueueIcon />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Queue is empty</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Play a song or add songs to the queue</p>
            </div>
          ) : (
            <div className="space-y-0.5 p-2">
              {upNext.map((song, index) => (
                <QueueItem
                  key={`${song.id}-${index}`}
                  song={song}
                  index={index}
                  isManual={index < manualQueueCount}
                  onRemove={removeFromQueue}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
