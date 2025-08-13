"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"
import { useNotificationStore } from "@/stores/notification-store"

interface MainLayoutProps {
  children: React.ReactNode
  activeRoute?: string
}

export function MainLayout({ children, activeRoute }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { connect, disconnect } = useNotificationStore()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // 컴포넌트 마운트 시 SSE 연결 시작
  useEffect(() => {
    connect()

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={toggleSidebar} />

      <Sidebar isOpen={sidebarOpen} activeRoute={activeRoute} />

      {/* Main Content Area */}
      <main className={cn("pt-16 transition-all duration-200 ease-in-out", sidebarOpen ? "lg:pl-64" : "")}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
