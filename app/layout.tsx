import type { Metadata } from "next"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: "Next.js Enterprise Boilerplate",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
