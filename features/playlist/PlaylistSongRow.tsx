"use client"

import type { PlaylistSong } from "lib/types"

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  )
}

interface PlaylistSongRowProps {
  song: PlaylistSong
  index: number
  onRemove: (id: string) => void
  onPlay: (song: PlaylistSong) => void
}

export function PlaylistSongRow({ song, index, onRemove, onPlay }: PlaylistSongRowProps) {
  return (
    <tr
      onClick={() => onPlay(song)}
      className="group cursor-pointer rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <td className="w-10 py-2 pr-2 pl-3 text-sm text-gray-400 dark:text-gray-500">{index + 1}</td>
      <td className="py-2 pr-3">
        <div className="flex items-center gap-3">
          <img
            src={song.cover_url}
            alt={song.title}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
          </div>
        </div>
      </td>
      <td className="py-2 pr-3 text-sm text-gray-500 dark:text-gray-400">{song.artist}</td>
      <td className="py-2 pr-3 text-right text-sm text-gray-400 dark:text-gray-500">
        <div className="flex items-center justify-end gap-3">
          <span className="tabular-nums">
            {/* PlaylistSong has no duration field; show dash until data includes it */}
            --:--
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(song.id)
            }}
            className="opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Remove ${song.title} from playlist`}
          >
            <TrashIcon className="size-4 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  )
}
