"use client"

import { useParams } from 'react-router-dom'
import PlaylistDetailPage from './playlist-detail-page'

export default function PlaylistDetailPageWrapper() {
  const { playlistId } = useParams<{ playlistId: string }>()
  
  if (!playlistId) {
    return <div>Playlist ID not found</div>
  }
  
  return <PlaylistDetailPage playlistId={playlistId} />
}