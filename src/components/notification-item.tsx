"use client"

import { Button } from "@/components/ui/button"

interface NotificationItemProps {
  notification: {
    id: string
    title: string
    message: string
    timestamp: string
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const handleClick = () => {
    // 나중에 알림 삭제나 상세보기 기능이 여기에 추가될 예정
    console.log("Notification clicked:", notification.id)
  }

  return (
    <Button
      variant="ghost"
      className="w-full h-auto p-3 justify-start text-left hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start w-full gap-3">
        <div className="flex-1 space-y-1">
          <p className="font-medium text-sm text-gray-900 leading-tight">{notification.title}</p>
          <p className="text-xs text-gray-500 leading-tight">{notification.message}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{notification.timestamp}</span>
      </div>
    </Button>
  )
}
