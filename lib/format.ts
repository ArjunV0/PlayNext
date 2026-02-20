const SECONDS_PER_MINUTE = 60

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE)
  const secs = Math.floor(seconds % SECONDS_PER_MINUTE)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
