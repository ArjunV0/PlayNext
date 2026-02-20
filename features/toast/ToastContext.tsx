"use client"

import { createContext, useCallback, useRef, useState } from "react"

interface ToastContextValue {
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 3000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("")
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(msg)
    setVisible(true)
    timerRef.current = setTimeout(() => {
      setVisible(false)
    }, TOAST_DURATION_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-gray-900/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-sm dark:bg-gray-100/90 dark:text-gray-900">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}
