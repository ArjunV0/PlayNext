"use client"

import { useEffect, useState } from "react"

import { usePathname } from "next/navigation"

import * as Dialog from "@radix-ui/react-dialog"

import { SidebarNav } from "./SidebarNav"
import { SidebarProfile } from "./SidebarProfile"

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

export function SidebarTrigger() {
  return (
    <Dialog.Trigger asChild>
      <button
        className="flex size-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Open navigation menu"
      >
        <HamburgerIcon className="size-5" />
      </button>
    </Dialog.Trigger>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          className="data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <SidebarNav />
          <div className="mt-auto border-t border-gray-200 dark:border-gray-700">
            <SidebarProfile />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
