import { AuthGuard } from "features/auth"
import { Header } from "features/header"
import { PlayerBar } from "features/player/PlayerBar"
import { QueuePanel } from "features/queue/QueuePanel"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Header />
      <div className="flex">
        <main className="mx-auto w-full max-w-screen-xl px-4 py-4 pb-24 sm:py-8">{children}</main>
      </div>
      <QueuePanel />
      <PlayerBar />
    </AuthGuard>
  )
}
