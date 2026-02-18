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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <LoginCard searchParams={searchParams} />
    </main>
  )
}
