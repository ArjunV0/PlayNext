export type Song = {
  id: string
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
  duration?: number
}

export type Playlist = {
  id: string
  name: string
  created_at: string
}

export type PlaylistSong = {
  id: string
  playlist_id: string
  song_id: string
  title: string
  artist: string
  cover_url: string
  audio_url: string
  added_at: string
}
