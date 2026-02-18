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
    <main className="flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LoginCard searchParams={searchParams} />
    </main>
  )
}
