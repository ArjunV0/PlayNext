import type { Metadata } from "next"
import "styles/tailwind.css"

import { AuthProvider } from "features/auth"
import { PlayerProvider } from "features/player/PlayerContext"
import { SearchProvider } from "features/search/SearchProvider"
import { ThemeProvider } from "features/theme/ThemeProvider"
import { ToastProvider } from "features/toast"

export const metadata: Metadata = {
  title: "PlayNext",
  description: "A minimal animated music preview web app.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <PlayerProvider>
                <SearchProvider>{children}</SearchProvider>
              </PlayerProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
