"use client"

import { useParams } from 'react-router-dom'
import ChatPage from './ChatPage'

export default function ChatPageWrapper() {
  const { userId } = useParams<{ userId: string }>()
  
  if (!userId) {
    return <div>User ID not found</div>
  }
  
  return <ChatPage userId={userId} />
}