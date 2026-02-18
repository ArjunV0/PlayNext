export interface Song {
  id: string
  title: string
  artist: string
  duration: number
  coverUrl: string
}

export const MAX_RECENT_SEARCHES = 2
export const DEBOUNCE_DELAY_MS = 300
export const RECENT_SEARCHES_KEY = "recentSearches"
