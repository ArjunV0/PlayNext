import type { Metadata } from "next"
import "styles/tailwind.css"

import { AuthProvider } from "features/auth"
import { PlayerProvider } from "features/player/PlayerContext"
import { SearchProvider } from "features/search/SearchProvider"
import { ThemeProvider } from "features/theme/ThemeProvider"
import { createClient } from "lib/supabase/server"

export const metadata: Metadata = {
  title: "PlayNext",
  description: "A minimal animated music preview web app.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = user ? await supabase.auth.getSession() : { data: { session: null } }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <AuthProvider initialSession={session}>
          <ThemeProvider>
            <PlayerProvider>
              <SearchProvider>{children}</SearchProvider>
            </PlayerProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
