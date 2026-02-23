import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "styles/tailwind.css"

import { AuthProvider } from "features/auth"
import { PlayerProvider } from "features/player/PlayerContext"
import { PlaylistProvider } from "features/playlist"
import { SearchProvider } from "features/search/SearchProvider"
import { ThemeProvider } from "features/theme/ThemeProvider"
import { ToastProvider } from "features/toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "PlayNext",
  description: "A minimal animated music preview web app.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-white font-sans text-gray-900 dark:bg-gray-900 dark:text-white">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <PlayerProvider>
                <PlaylistProvider>
                  <SearchProvider>{children}</SearchProvider>
                </PlaylistProvider>
              </PlayerProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
