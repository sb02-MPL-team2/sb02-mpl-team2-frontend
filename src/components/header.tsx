"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Bell, User, UserCog, LogOut } from "lucide-react"
import { NotificationItem } from "./notification-item"

interface HeaderProps {
  onMenuClick: () => void
  notifications: Array<{
    id: string
    title: string
    message: string
    timestamp: string
  }>
}

export function Header({ onMenuClick, notifications }: HeaderProps) {
  const notificationCount = notifications.length

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">모두의 플리</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600 hover:bg-purple-700"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">알림 ({notificationCount})</h3>
              </div>
              <ScrollArea className="h-80">
                <div className="p-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">새로운 알림이 없습니다.</div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile/edit" className="flex items-center gap-2 cursor-pointer">
                  <UserCog className="h-4 w-4" />
                  정보 변경
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
