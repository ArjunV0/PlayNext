"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { twMerge } from "tailwind-merge"

import { updatePassword } from "features/auth/actions"

const cardClass = twMerge(
  "w-full max-w-sm space-y-4 rounded-2xl p-5 shadow-xl sm:space-y-6 sm:p-8",
  "border border-white/20 bg-white/70 backdrop-blur-xl",
  "dark:border-gray-700/50 dark:bg-gray-800/70"
)

const inputClass = twMerge(
  "w-full rounded-lg border border-white/30 bg-white/50 px-4 py-3 backdrop-blur",
  "text-sm text-gray-900 placeholder-gray-400",
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
  "dark:border-gray-600/50 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500",
  "dark:focus:border-blue-400 dark:focus:ring-blue-400"
)

const buttonClass = twMerge(
  "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3",
  "text-sm font-medium transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
)

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    startTransition(async () => {
      const result = await updatePassword(password)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className={cardClass}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Password updated</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your password has been set. You can now sign in with your new password.
            </p>
          </div>
          <button type="button" onClick={() => router.push("/login")} className={buttonClass}>
            Go to sign in
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/5" />
      <div className={cardClass}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set new password</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your new password below.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={isPending} className={buttonClass}>
            {isPending ? "Updating..." : "Update password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    </main>
  )
}
