import { NextRequest } from "next/server"

import { z } from "zod"

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  offset: z.coerce.number().int().min(0).max(500).default(0),
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

  const { q, limit, offset } = parsed.data

  const searchParams = new URLSearchParams({
    term: q,
    media: "music",
    limit: String(limit + offset),
  })

  const response = await fetch(`https://itunes.apple.com/search?${searchParams.toString()}`)
  if (!response.ok) {
    return Response.json({ results: [], totalCount: 0 })
  }

  const data = (await response.json()) as ITunesResponse
  const filtered = data.results
    .filter((r) => r.previewUrl)
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : 0,
      coverUrl: r.artworkUrl100.replace("100x100", "300x300"),
      audioUrl: r.previewUrl,
    }))

  const results = filtered.slice(offset, offset + limit)
  const totalCount = filtered.length

  return Response.json({ results, totalCount })
}
