"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

const mockNotifications = [
  {
    id: "n1",
    title: "woody 님이 메시지를 보냈어요.",
    message: "좋은 자료들 잘 큐레이팅 해주셔서...",
    timestamp: "3분 전",
  },
  {
    id: "n2",
    title: "프로필이 업데이트되었어요.",
    message: "비밀번호가 성공적으로 변경되었습니다.",
    timestamp: "1시간 전",
  },
  {
    id: "n3",
    title: "새로운 콘텐츠!",
    message: "회원님이 좋아할 만한 새 영화가 추가...",
    timestamp: "5시간 전",
  },
  {
    id: "n4",
    title: "woody 님이 메시지를 보냈어요.",
    message: "좋은 자료들 잘 큐레이팅 해주셔서...",
    timestamp: "1일 전",
  },
  {
    id: "n5",
    title: "프로필이 업데이트되었어요.",
    message: "비밀번호가 성공적으로 변경되었습니다.",
    timestamp: "2일 전",
  },
  {
    id: "n6",
    title: "새로운 콘텐츠!",
    message: "회원님이 좋아할 만한 새 영화가 추가...",
    timestamp: "3일 전",
  },
]

interface MainLayoutProps {
  children: React.ReactNode
  activeRoute?: string
}

export function MainLayout({ children, activeRoute }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={toggleSidebar} notifications={mockNotifications} />

      <Sidebar isOpen={sidebarOpen} activeRoute={activeRoute} />

      {/* Main Content Area */}
      <main className={cn("pt-16 transition-all duration-200 ease-in-out", sidebarOpen ? "lg:pl-64" : "")}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
