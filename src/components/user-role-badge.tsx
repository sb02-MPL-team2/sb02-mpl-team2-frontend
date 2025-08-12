"use client"

import { Badge } from "@/components/ui/badge"
import { USER_ROLES } from "@/lib/constants"

interface UserRoleBadgeProps {
  role: typeof USER_ROLES.ADMIN | typeof USER_ROLES.MANAGER | typeof USER_ROLES.USER
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const isAdmin = role === USER_ROLES.ADMIN
  const isManager = role === USER_ROLES.MANAGER
  
  const getRoleName = () => {
    if (isAdmin) return '운영자'
    if (isManager) return '매니저'
    return '일반 사용자'
  }
  
  const getVariantAndClass = () => {
    if (isAdmin) {
      return { variant: 'destructive' as const, customClass: 'bg-purple-600 hover:bg-purple-700' }
    }
    if (isManager) {
      return { variant: 'default' as const, customClass: 'bg-blue-600 hover:bg-blue-700 text-white' }
    }
    return { variant: 'secondary' as const, customClass: '' }
  }
  
  const { variant, customClass } = getVariantAndClass()
  
  return (
    <Badge 
      variant={variant}
      className={`${customClass} ${className || ''}`}
    >
      {getRoleName()}
    </Badge>
  )
}