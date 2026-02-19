"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { useAuth } from "./useAuth"
import { signOut } from "./actions"

const AVATAR_SIZE = 32
const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"

export function UserMenu() {
  const { user } = useAuth()

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url ?? FALLBACK_AVATAR
  const email = user.email ?? ""

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="User menu"
        >
          <img
            src={avatarUrl}
            alt=""
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="rounded-full"
            referrerPolicy="no-referrer"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
