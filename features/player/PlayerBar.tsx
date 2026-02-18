"use client"

import { PlayerControls } from "./PlayerControls"
import { PlayerProgress } from "./PlayerProgress"
import { usePlayer } from "./usePlayer"

export function PlayerBar() {
  const { currentSong } = usePlayer()

  if (!currentSong) return null

  return (
    <div className="fixed right-0 bottom-0 left-0 border-t border-white/20 bg-white/60 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/60">
      <div className="mx-auto max-w-screen-lg px-3 pt-2 pb-3 sm:px-4">
        <PlayerProgress />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {currentSong.coverUrl ? (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="size-10 shrink-0 rounded bg-gray-200 object-cover dark:bg-gray-700"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded bg-gray-200 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                ♪
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{currentSong.title}</p>
              {currentSong.artist && (
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{currentSong.artist}</p>
              )}
            </div>
          </div>
          <PlayerControls />
        </div>
      </div>
    </div>
  )
}
