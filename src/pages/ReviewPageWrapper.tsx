"use client"

import { useParams } from 'react-router-dom'
import ReviewPage from './ReviewPage'

export default function ReviewPageWrapper() {
  const { contentId } = useParams<{ contentId: string }>()
  
  if (!contentId) {
    return <div>Content ID not found</div>
  }
  
  return <ReviewPage contentId={contentId} />
}