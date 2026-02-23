"use client"

import { useEffect, useState } from "react"

import Link from "next/link"

import { extractColor, FALLBACK_HSL } from "lib/colorExtractor"
import type { PlaylistSong, Song } from "lib/types"
import { usePlayer } from "features/player/usePlayer"

import { usePlaylist } from "./usePlaylist"
import { PlaylistSongRow } from "./PlaylistSongRow"
import { DeletePlaylistDialog } from "./DeletePlaylistDialog"

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

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

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
      />
    </svg>
  )
}

function playlistSongToSong(ps: PlaylistSong): Song {
  return {
    id: ps.song_id,
    title: ps.title,
    artist: ps.artist,
    coverUrl: ps.cover_url,
    audioUrl: ps.audio_url,
  }
}

interface PlaylistPageProps {
  playlistId: string
}

export function PlaylistPage({ playlistId }: PlaylistPageProps) {
  const { playlists, getPlaylistSongs, removeSongFromPlaylist, isLoading: playlistsLoading } = usePlaylist()
  const { playSong, isShuffle, toggleShuffle, currentSong } = usePlayer()
  const [songs, setSongs] = useState<PlaylistSong[]>([])
  const [songsLoading, setSongsLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [heroHsl, setHeroHsl] = useState(FALLBACK_HSL)

  const playlist = playlists.find((p) => p.id === playlistId) ?? null

  useEffect(() => {
    if (playlistsLoading) return

    async function fetchSongs() {
      setSongsLoading(true)
      const data = await getPlaylistSongs(playlistId)
      setSongs(data)
      setSongsLoading(false)
    }

    void fetchSongs()
  }, [playlistId, getPlaylistSongs, playlistsLoading])

  useEffect(() => {
    if (songs.length === 0) return
    const firstSong = songs[0]
    if (!firstSong?.cover_url) return
    extractColor(firstSong.cover_url).then(setHeroHsl)
  }, [songs])

  const isPlayingFromPlaylist = Boolean(currentSong && songs.some((s) => s.song_id === currentSong.id))

  const heroGradient = isPlayingFromPlaylist
    ? `linear-gradient(135deg, hsla(var(--ambient-h, ${heroHsl.h}), var(--ambient-s, ${heroHsl.s}%), var(--ambient-l, ${
        heroHsl.l
      }%), 0.9) 0%, hsla(${heroHsl.h}, ${heroHsl.s}%, ${Math.max(heroHsl.l - 15, 10)}%, 0.95) 100%)`
    : `linear-gradient(135deg, hsla(${heroHsl.h}, ${heroHsl.s}%, ${heroHsl.l}%, 0.9) 0%, hsla(${heroHsl.h}, ${
        heroHsl.s
      }%, ${Math.max(heroHsl.l - 15, 10)}%, 0.95) 100%)`

  const handleRemove = async (playlistSongId: string) => {
    await removeSongFromPlaylist(playlistSongId)
    setSongs((prev) => prev.filter((s) => s.id !== playlistSongId))
  }

  const handlePlay = (song: PlaylistSong) => {
    const allSongs = songs.map(playlistSongToSong)
    const target = playlistSongToSong(song)
    playSong(target, allSongs)
  }

  const handlePlayAll = () => {
    if (songs.length === 0) return
    const allSongs = songs.map(playlistSongToSong)
    const first = allSongs[0]
    if (!first) return
    playSong(first, allSongs)
  }

  const isLoading = playlistsLoading || songsLoading

  if (!playlistsLoading && !playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <MusicNoteIcon className="mb-4 size-16 text-gray-300 dark:text-gray-600" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Playlist not found</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          This playlist may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
        >
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hero header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg sm:p-8"
        style={{
          background: heroGradient,
          transition: "background 1s ease-out",
        }}
      >
        {/* Album art mosaic / fallback */}
        <div className="absolute inset-0 overflow-hidden">
          {songs.length >= 4 ? (
            /* 2x2 seamless mosaic */
            <div className="grid h-full w-full grid-cols-2 grid-rows-2 opacity-30">
              {songs.slice(0, 4).map((song) => (
                <img
                  key={song.id}
                  src={song.cover_url}
                  alt=""
                  className="h-full w-full object-cover"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : songs.length > 0 && songs[0]?.cover_url ? (
            /* Single enlarged album art fallback */
            <img src={songs[0].cover_url} alt="" className="h-full w-full object-cover opacity-25" aria-hidden="true" />
          ) : (
            /* Empty playlist: gradient-only with subtle music note icon */
            <div className="flex h-full w-full items-center justify-center opacity-10">
              <MusicNoteIcon className="size-32" />
            </div>
          )}
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            {isLoading ? (
              <div className="animate-wave-shimmer mb-2 h-9 w-48 rounded-lg bg-white/20" />
            ) : (
              <h1 className="text-3xl font-bold sm:text-4xl">{playlist?.name}</h1>
            )}
            <p className="mt-1 text-sm text-white/70">
              {isLoading ? (
                <span className="animate-wave-shimmer inline-block h-4 w-24 rounded bg-white/20" />
              ) : (
                `${songs.length} ${songs.length === 1 ? "song" : "songs"}`
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled={songs.length === 0 || isLoading}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-indigo-700 transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlayIcon className="size-4" />
              Play
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isShuffle) toggleShuffle()
                handlePlayAll()
              }}
              disabled={songs.length === 0 || isLoading}
              className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                isShuffle
                  ? "border-white bg-white/20 text-white"
                  : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="ml-auto flex items-center justify-center rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Delete playlist"
            >
              <TrashIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Song table or empty state */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-wave-shimmer h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MusicNoteIcon className="mb-4 size-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">No songs yet</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Add songs to this playlist while browsing music.
          </p>
          <Link
            href="/"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            Browse music
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="w-10 py-2 pr-2 pl-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  #
                </th>
                <th className="py-2 pr-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Title
                </th>
                <th className="py-2 pr-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Artist
                </th>
                <th className="py-2 pr-3 text-right text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, i) => (
                <PlaylistSongRow key={song.id} song={song} index={i} onRemove={handleRemove} onPlay={handlePlay} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeletePlaylistDialog open={deleteOpen} onOpenChange={setDeleteOpen} playlist={playlist} />
    </div>
  )
}
