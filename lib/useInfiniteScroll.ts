"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface FetchPageResult<T> {
  items: T[]
  hasMore: boolean
}

interface UseInfiniteScrollOptions<T> {
  fetchPage: (offset: number) => Promise<FetchPageResult<T>>
  initialItems?: T[]
  enabled?: boolean
}

interface UseInfiniteScrollReturn<T> {
  items: T[]
  sentinelRef: React.RefCallback<HTMLDivElement>
  isLoadingMore: boolean
  hasMore: boolean
}

export function useInfiniteScroll<T>({
  fetchPage,
  initialItems = [],
  enabled = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const offsetRef = useRef(initialItems.length)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelNodeRef = useRef<HTMLDivElement | null>(null)
  const isLoadingRef = useRef(false)

  // Sync initial items when they change
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems)
      offsetRef.current = initialItems.length
      setHasMore(true)
    }
  }, [initialItems])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !enabled) return
    isLoadingRef.current = true
    setIsLoadingMore(true)

    try {
      const result = await fetchPage(offsetRef.current)
      setItems((prev) => [...prev, ...result.items])
      offsetRef.current += result.items.length
      setHasMore(result.hasMore)
    } catch {
      setHasMore(false)
    } finally {
      isLoadingRef.current = false
      setIsLoadingMore(false)
    }
  }, [fetchPage, enabled])

  // Ref callback handles observer setup/cleanup
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      sentinelNodeRef.current = node

      if (!node || !enabled) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            void loadMore()
          }
        },
        { rootMargin: "200px" }
      )
      observerRef.current.observe(node)
    },
    [loadMore, enabled]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return { items, sentinelRef, isLoadingMore, hasMore }
}
