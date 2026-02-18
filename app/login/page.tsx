import type { Metadata } from "next"

import { LoginCard } from "features/auth/LoginCard"

export const metadata: Metadata = {
  title: "Sign In — PlayNext",
}

interface LoginPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 px-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-500/5" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-indigo-300/5 blur-3xl dark:bg-indigo-500/3" />
      <LoginCard searchParams={searchParams} />
    </main>
  )
}
