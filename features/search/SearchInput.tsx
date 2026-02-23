"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { useSearch } from "./useSearch"

const SEARCH_DEBOUNCE_MS = 300

function SearchIcon() {
  return (
    <svg
      className="size-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function SearchInput() {
  const { query, setQuery, isLoading } = useSearch()
  const router = useRouter()
  const pathname = usePathname()
  const [localValue, setLocalValue] = useState(query)
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const isQueryEmpty = localValue.trim() === ""
  const isOnSearch = pathname === "/search"

  // Sync local value only when context query changes externally (e.g. recent search click),
  // NOT when our own debounce pushes to context (which would overwrite mid-typing state)
  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalValue(query)
    }
  }, [query])

  const handleChange = (value: string) => {
    // Update LOCAL state immediately — only this component re-renders
    setLocalValue(value)
    isTypingRef.current = true

    // Debounce both context update AND router navigation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      isTypingRef.current = false
      const trimmed = value.trim()
      setQuery(trimmed)
      if (trimmed) {
        const url = `/search?q=${encodeURIComponent(trimmed)}`
        if (isOnSearch) {
          router.replace(url, { scroll: false })
        } else {
          router.push(url, { scroll: false })
        }
      } else if (isOnSearch) {
        router.replace("/search", { scroll: false })
      }
    }, SEARCH_DEBOUNCE_MS)
  }

  const handleClear = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    isTypingRef.current = false
    setLocalValue("")
    setQuery("")
    if (isOnSearch) {
      router.replace("/search", { scroll: false })
    }
  }

  const focusedBorder = "1px solid hsla(var(--ambient-h, 240), var(--ambient-s, 70%), var(--ambient-l, 60%), 0.5)"
  const defaultBorder = "1px solid rgba(229, 231, 235, 0.6)"
  const focusedBoxShadow =
    "0 0 0 2px hsla(var(--ambient-h, 240), var(--ambient-s, 70%), var(--ambient-l, 60%), 0.4), 0 0 15px hsla(var(--ambient-h, 240), var(--ambient-s, 70%), var(--ambient-l, 60%), 0.15)"

  return (
    <div className="relative w-full">
      {/* Visual container: holds border, bg, glow, scale */}
      <div
        className="relative rounded-xl bg-gray-50/80 dark:bg-gray-800/80"
        style={{
          border: isFocused ? focusedBorder : defaultBorder,
          boxShadow: isFocused ? focusedBoxShadow : "none",
          transform: isFocused ? "scale(1.01)" : "scale(1)",
          transition: "none",
        }}
      >
        {/* Search icon */}
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search songs or artists..."
          className="w-full rounded-xl bg-transparent py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
        />
        {/* Clear button or loading indicator */}
        {isLoading ? (
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            <svg className="size-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : !isQueryEmpty ? (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        ) : null}
      </div>
    </div>
  )
}
