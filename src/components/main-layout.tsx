"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

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
      <Header onMenuClick={toggleSidebar} />

      <Sidebar isOpen={sidebarOpen} activeRoute={activeRoute} />

      {/* Main Content Area */}
      <main className={cn("pt-16 transition-all duration-200 ease-in-out", sidebarOpen ? "lg:pl-64" : "")}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
