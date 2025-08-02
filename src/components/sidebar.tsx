"use client"

import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/authStore"
import { USER_ROLES } from "@/lib/constants"

interface SidebarProps {
  isOpen: boolean
  activeRoute?: string
}

const baseNavigationItems = [
  { label: "콘텐츠 같이 보기", href: "/contents" },
  { label: "플레이리스트", href: "/playlists" },
  { label: "사용자 프로필", href: "/profiles" },
]

const adminNavigationItems = [
  { label: "사용자 관리", href: "/admin/users" },
]

export function Sidebar({ isOpen, activeRoute }: SidebarProps) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === USER_ROLES.ADMIN
  
  // 관리자인 경우에만 관리자 메뉴 추가
  const navigationItems = isAdmin 
    ? [...baseNavigationItems, ...adminNavigationItems]
    : baseNavigationItems
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}} // This would close sidebar on mobile
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = activeRoute === item.href
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <Star className={cn("h-4 w-4", isActive ? "text-purple-600" : "text-gray-500")} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
