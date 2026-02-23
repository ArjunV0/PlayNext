import { NextRequest } from "next/server"

import { z } from "zod"

const TIMEOUT_MS = 5000

const proxySchema = z.object({
  url: z
    .string()
    .min(1)
    .refine(
      (val) => {
        try {
          const parsed = new URL(val)
          return parsed.hostname.endsWith(".mzstatic.com")
        } catch {
          return false
        }
      },
      { message: "URL must be from mzstatic.com" },
    ),
})

export async function GET(request: NextRequest): Promise<Response> {
  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = proxySchema.safeParse(params)

  if (!parsed.success) {
    return Response.json({ error: "Invalid URL" }, { status: 400 })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstream = await fetch(parsed.data.url, {
      signal: controller.signal,
    })

    if (!upstream.ok) {
      return Response.json({ error: "Upstream fetch failed" }, { status: 502 })
    }

    const contentType = upstream.headers.get("Content-Type") ?? "image/jpeg"

    return new Response(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch {
    return Response.json({ error: "Upstream fetch failed" }, { status: 502 })
  } finally {
    clearTimeout(timeoutId)
  }
}
