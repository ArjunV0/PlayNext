import { PlaylistPage } from "features/playlist/PlaylistPage"

export default async function PlaylistRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlaylistPage playlistId={id} />
}
