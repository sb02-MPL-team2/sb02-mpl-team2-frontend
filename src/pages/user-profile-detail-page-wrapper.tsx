"use client"

import { useParams } from 'react-router-dom'
import UserProfileDetailPage from './user-profile-detail-page'

export default function UserProfileDetailPageWrapper() {
  const { userId } = useParams<{ userId: string }>()
  
  if (!userId) {
    return <div>User ID not found</div>
  }
  
  return <UserProfileDetailPage userId={userId} />
}