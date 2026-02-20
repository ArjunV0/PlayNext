"use client"

import { useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { usePlaylist, CreatePlaylistDialog } from "features/playlist"
import { useSearch } from "features/search/useSearch"

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
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

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { playlists } = usePlaylist()
  const { query } = useSearch()
  const [createOpen, setCreateOpen] = useState(false)

  const searchHref = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Nav links (fixed, non-scrolling) */}
      <nav className="shrink-0 p-4">
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const resolvedHref = href === "/search" ? searchHref : href
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={resolvedHref}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-l-[3px] border-amber-500 bg-amber-500/10 pl-[9px] font-semibold text-gray-900 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-4 shrink-0 border-t border-gray-200 dark:border-gray-700" />

      {/* Playlists section (scrollable) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 pt-3">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
            Playlists
          </span>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex size-6 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Create new playlist"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {playlists.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <button type="button" onClick={() => setCreateOpen(true)} className="underline-offset-2 hover:underline">
              Create your first playlist
            </button>
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 overflow-y-auto">
            {playlists.map((playlist) => {
              const isActive = pathname === `/playlist/${playlist.id}`
              return (
                <li key={playlist.id}>
                  <Link
                    href={`/playlist/${playlist.id}`}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "border-l-[3px] border-amber-500 bg-amber-500/10 pl-[9px] font-semibold text-gray-900 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <MusicNoteIcon className="size-4 shrink-0" />
                    <span className="truncate">{playlist.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <CreatePlaylistDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
