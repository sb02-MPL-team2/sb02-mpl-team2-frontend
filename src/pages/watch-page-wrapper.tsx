"use client"

import { useParams } from 'react-router-dom'
import WatchPage from './watch-page'

export default function WatchPageWrapper() {
  const { contentId } = useParams<{ contentId: string }>()
  
  if (!contentId) {
    return <div>Content ID not found</div>
  }
  
  return <WatchPage contentId={contentId} />
}