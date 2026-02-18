"use client"

import { use, useActionState, useState } from "react"

import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

import { signInWithGoogle, signInWithMagicLink } from "./actions"

import { APP_NAME } from "lib/constants"

const AUTH_ERRORS: Record<string, string> = {
  auth_callback_failed: "Authentication failed. Please try again.",
  oauth_failed: "Could not connect to Google. Please try again.",
}

const button = cva(
  [
    "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3",
    "text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        google: [
          "border border-gray-300 bg-white text-gray-700",
          "hover:bg-gray-50",
          "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
          "dark:hover:bg-gray-700",
        ],
        magic: [
          "bg-blue-600 text-white",
          "hover:bg-blue-700",
          "dark:bg-blue-500 dark:hover:bg-blue-600",
        ],
      },
    },
  }
)

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

interface LoginCardProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export function LoginCard({ searchParams }: LoginCardProps) {
  const params = use(searchParams)
  const errorCode = params.error
  const redirectTo = params.next

  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const [magicLinkState, magicLinkAction, isMagicLinkPending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const email = formData.get("email") as string
      const result = await signInWithMagicLink(email, redirectTo)
      if (!result.error) setMagicLinkSent(true)
      return result
    },
    { error: null }
  )

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    await signInWithGoogle(redirectTo)
  }

  const errorMessage = errorCode ? AUTH_ERRORS[errorCode] : magicLinkState.error

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We sent a magic link to your email. Click the link to sign in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMagicLinkSent(false)}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to continue</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className={twMerge(button({ variant: "google" }))}
      >
        <GoogleIcon />
        {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <form action={magicLinkAction} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className={twMerge(
            "w-full rounded-lg border border-gray-300 bg-white px-4 py-3",
            "text-sm text-gray-900 placeholder-gray-400",
            "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500",
            "dark:focus:border-blue-400 dark:focus:ring-blue-400"
          )}
        />
        <button
          type="submit"
          disabled={isMagicLinkPending}
          className={twMerge(button({ variant: "magic" }))}
        >
          {isMagicLinkPending ? "Sending..." : "Send magic link"}
        </button>
      </form>
    </div>
  )
}
