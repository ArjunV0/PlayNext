"use client"

import { createContext, useCallback, useRef, useState } from "react"

interface Toast {
  id: number
  message: string
  exiting: boolean
}

interface ToastContextValue {
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 3000
const EXIT_DURATION_MS = 200
const MAX_TOASTS = 3

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismissToast = useCallback((id: number) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    // Remove after exit animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, EXIT_DURATION_MS)
    // Clean up timer
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message: string) => {
      const id = nextId++
      setToasts((prev) => {
        const updated = [...prev, { id, message, exiting: false }]
        // If exceeding max, dismiss the oldest
        if (updated.length > MAX_TOASTS) {
          const oldest = updated[0]
          if (oldest) {
            setTimeout(() => dismissToast(oldest.id), 0)
          }
        }
        return updated
      })

      const timer = setTimeout(() => {
        dismissToast(id)
      }, TOAST_DURATION_MS)
      timersRef.current.set(id, timer)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — bottom-center, above player bar */}
      <div
        className="pointer-events-none fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col-reverse items-center gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass-toast pointer-events-auto px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white ${
              toast.exiting ? "animate-toast-exit" : "animate-toast-enter"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
