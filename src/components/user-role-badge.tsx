"use client"

import { Badge } from "@/components/ui/badge"
import { USER_ROLES } from "@/lib/constants"

interface UserRoleBadgeProps {
  role: typeof USER_ROLES.ADMIN | typeof USER_ROLES.USER
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const isAdmin = role === USER_ROLES.ADMIN
  
  return (
    <Badge 
      variant={isAdmin ? 'destructive' : 'secondary'}
      className={`${isAdmin ? 'bg-purple-600 hover:bg-purple-700' : ''} ${className || ''}`}
    >
      {isAdmin ? '운영자' : '일반 사용자'}
    </Badge>
  )
}