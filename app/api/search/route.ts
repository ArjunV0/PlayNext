import { NextRequest } from "next/server"

import { z } from "zod"

const searchSchema = z.object({
  q: z.string().min(1).max(100),
})

interface ITunesResult {
  trackId: number
  trackName: string
  artistName: string
  artworkUrl100: string
  previewUrl: string
  trackTimeMillis?: number
}

interface ITunesResponse {
  resultCount: number
  results: ITunesResult[]
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = searchSchema.safeParse(params)

  if (!parsed.success) {
    return Response.json({ error: "Invalid query parameter" }, { status: 400 })
  }

  const searchParams = new URLSearchParams({
    term: parsed.data.q,
    media: "music",
    limit: "10",
  })

  const response = await fetch(`https://itunes.apple.com/search?${searchParams.toString()}`)
  if (!response.ok) {
    return Response.json({ results: [] })
  }

  const data = (await response.json()) as ITunesResponse
  const results = data.results
    .filter((r) => r.previewUrl)
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : 0,
      coverUrl: r.artworkUrl100.replace("100x100", "300x300"),
      audioUrl: r.previewUrl,
    }))

  return Response.json({ results })
}
