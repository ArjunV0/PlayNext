import { NextRequest } from "next/server"

import { z } from "zod"

const songsSchema = z.object({
  term: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(20).default(6),
})

interface ITunesResult {
  trackId: number
  trackName: string
  artistName: string
  artworkUrl100: string
  previewUrl: string
}

interface ITunesResponse {
  resultCount: number
  results: ITunesResult[]
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = songsSchema.safeParse(params)

  if (!parsed.success) {
    return Response.json({ songs: [] }, { status: 400 })
  }

  const searchParams = new URLSearchParams({
    term: parsed.data.term,
    media: "music",
    limit: String(parsed.data.limit),
  })

  const response = await fetch(`https://itunes.apple.com/search?${searchParams.toString()}`)
  if (!response.ok) {
    return Response.json({ songs: [] })
  }

  const data = (await response.json()) as ITunesResponse
  const songs = data.results
    .filter((r) => r.previewUrl)
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      coverUrl: r.artworkUrl100.replace("100x100", "300x300"),
      audioUrl: r.previewUrl,
    }))

  return Response.json({ songs })
}
