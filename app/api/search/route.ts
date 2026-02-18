import { NextRequest } from "next/server"

import { z } from "zod"

import type { Song } from "features/search/types"

const searchSchema = z.object({
  q: z.string().min(1).max(100),
})

const MOCK_SONGS: Song[] = [
  { id: "1", title: "Midnight Drive", artist: "Neon Waves", duration: 214, coverUrl: "/covers/midnight-drive.jpg" },
  { id: "2", title: "Echoes of You", artist: "Lunar Drift", duration: 187, coverUrl: "/covers/echoes-of-you.jpg" },
  { id: "3", title: "Fading Light", artist: "Glass Horizon", duration: 243, coverUrl: "/covers/fading-light.jpg" },
  { id: "4", title: "Ocean Breeze", artist: "Coral Skies", duration: 198, coverUrl: "/covers/ocean-breeze.jpg" },
  { id: "5", title: "Neon Nights", artist: "Neon Waves", duration: 226, coverUrl: "/covers/neon-nights.jpg" },
  { id: "6", title: "Still Waters", artist: "Amber Glow", duration: 175, coverUrl: "/covers/still-waters.jpg" },
  { id: "7", title: "Electric Pulse", artist: "Glass Horizon", duration: 201, coverUrl: "/covers/electric-pulse.jpg" },
  { id: "8", title: "Sunrise", artist: "Coral Skies", duration: 162, coverUrl: "/covers/sunrise.jpg" },
]

export async function GET(request: NextRequest): Promise<Response> {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = searchSchema.safeParse(params)

  if (!parsed.success) {
    return Response.json({ error: "Invalid query parameter" }, { status: 400 })
  }

  const query = parsed.data.q.toLowerCase()
  const results = MOCK_SONGS.filter(
    (song) => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
  )

  return Response.json({ results })
}
