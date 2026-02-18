import "styles/tailwind.css"

import { PlayerBar } from "features/player/PlayerBar"
import { PlayerProvider } from "features/player/PlayerContext"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  )
}
