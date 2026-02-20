"use client"

import { useAuth } from "features/auth"

export function SidebarProfile() {
  const { user, isLoading, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    )
  }

  const name = user?.user_metadata?.full_name ?? user?.email ?? "Guest"
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url

  const initial = name.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex items-center gap-3 p-4">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="size-9 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</p>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
