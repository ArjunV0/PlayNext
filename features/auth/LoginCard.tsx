"use client"

import { use, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

import {
  signInWithGoogle,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
  resetPassword,
} from "./actions"

import { APP_NAME } from "lib/constants"

const AUTH_ERRORS: Record<string, string> = {
  auth_callback_failed: "Authentication failed. Please try again.",
  oauth_failed: "Could not connect to Google. Please try again.",
}

type AuthView = "sign-in" | "sign-up" | "magic-link-sent" | "reset-password" | "reset-sent" | "confirm-email"

const cardClass = twMerge(
  "w-full max-w-sm space-y-6 rounded-2xl p-8 shadow-xl",
  "border border-white/20 bg-white/70 backdrop-blur-xl",
  "dark:border-gray-700/50 dark:bg-gray-800/70"
)

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
          "border border-gray-300/60 bg-white/60 text-gray-700 backdrop-blur",
          "hover:bg-white/80",
          "dark:border-gray-600/60 dark:bg-gray-800/60 dark:text-gray-200",
          "dark:hover:bg-gray-700/60",
        ],
        primary: [
          "bg-blue-600 text-white",
          "hover:bg-blue-700",
          "dark:bg-blue-500 dark:hover:bg-blue-600",
        ],
      },
    },
  }
)

const inputClass = twMerge(
  "w-full rounded-lg border border-white/30 bg-white/50 px-4 py-3 backdrop-blur",
  "text-sm text-gray-900 placeholder-gray-400",
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
  "dark:border-gray-600/50 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500",
  "dark:focus:border-blue-400 dark:focus:ring-blue-400"
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

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-300/40 dark:bg-gray-600/40" />
      <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
      <div className="h-px flex-1 bg-gray-300/40 dark:bg-gray-600/40" />
    </div>
  )
}

interface LoginCardProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export function LoginCard({ searchParams }: LoginCardProps) {
  const params = use(searchParams)
  const errorCode = params.error
  const redirectTo = params.next

  const router = useRouter()
  const [view, setView] = useState<AuthView>("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [urlErrorDismissed, setUrlErrorDismissed] = useState(false)

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSubmitting, startTransition] = useTransition()
  const [isMagicLinkPending, startMagicLink] = useTransition()
  const [isResetPending, startReset] = useTransition()

  function clearErrors() {
    setError(null)
    setUrlErrorDismissed(true)
  }

  async function handleGoogleSignIn() {
    clearErrors()
    setIsGoogleLoading(true)
    await signInWithGoogle(redirectTo)
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearErrors()

    startTransition(async () => {
      if (view === "sign-up") {
        const result = await signUpWithPassword(email, password, redirectTo)
        if (result.needsConfirmation) {
          setView("confirm-email")
          return
        }
        if (result.error) {
          setError(result.error)
          return
        }
      } else {
        const result = await signInWithPassword(email, password)
        if (result.error) {
          setError(result.error)
          return
        }
      }
      router.push(redirectTo ?? "/")
      router.refresh()
    })
  }

  function handleMagicLink() {
    if (!email) {
      setError("Enter your email address first.")
      return
    }
    clearErrors()

    startMagicLink(async () => {
      const result = await signInWithMagicLink(email, redirectTo)
      if (result.error) {
        setError(result.error)
      } else {
        setView("magic-link-sent")
      }
    })
  }

  function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearErrors()

    startReset(async () => {
      const result = await resetPassword(email, redirectTo)
      if (result.error) {
        setError(result.error)
      } else {
        setView("reset-sent")
      }
    })
  }

  const urlError = !urlErrorDismissed && errorCode ? AUTH_ERRORS[errorCode] : null
  const errorMessage = urlError ?? error

  // Confirmation screens
  if (view === "magic-link-sent") {
    return (
      <div className={cardClass}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We sent a magic link to your email. Click the link to sign in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { clearErrors(); setView("sign-in") }}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  if (view === "confirm-email") {
    return (
      <div className={cardClass}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Confirm your email</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We sent a confirmation link to your email. Click it to activate your account, then sign in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { clearErrors(); setView("sign-in") }}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  if (view === "reset-sent") {
    return (
      <div className={cardClass}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We sent a password reset link to your email. Click it to set a new password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { clearErrors(); setView("sign-in") }}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  // Reset password form
  if (view === "reset-password") {
    return (
      <div className={cardClass}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset password</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={isResetPending}
            className={twMerge(button({ variant: "primary" }))}
          >
            {isResetPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { clearErrors(); setView("sign-in") }}
          className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to sign in
        </button>
      </div>
    )
  }

  // Main sign-in / sign-up form
  const isSignUp = view === "sign-up"

  return (
    <div className={cardClass}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {isSignUp ? "Create an account" : "Sign in to continue"}
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50/80 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
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

      <Divider />

      <form onSubmit={handlePasswordSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={twMerge(button({ variant: "primary" }))}
        >
          {isSubmitting
            ? (isSignUp ? "Creating account..." : "Signing in...")
            : (isSignUp ? "Create account" : "Sign in")}
        </button>
      </form>

      {!isSignUp && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => { clearErrors(); setView("reset-password") }}
            className="text-gray-500 hover:underline dark:text-gray-400"
          >
            Forgot password?
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={isMagicLinkPending}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {isMagicLinkPending ? "Sending..." : "Send magic link"}
          </button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => { clearErrors(); setView(isSignUp ? "sign-in" : "sign-up") }}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  )
}
