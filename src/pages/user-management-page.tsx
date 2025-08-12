"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Shield, ShieldCheck, Lock, Unlock, Loader2, Trash2 } from "lucide-react"
import { UserRoleBadge } from "@/components/user-role-badge"
import { adminService } from "@/services/adminService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants"
import type { UserDto } from "@/types"

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'role' | 'lock' | 'delete' | null
    userId: number | null
    userName: string
    action: string
  }>({
    isOpen: false,
    type: null,
    userId: null,
    userName: "",
    action: ""
  })

  const { user: currentUser } = useAuthStore()
  const queryClient = useQueryClient()

  // 모든 사용자 목록 조회
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: adminService.getAllUsers,
  })

  // 권한 변경 mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'ADMIN' | 'MANAGER' | 'USER' }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
      setConfirmDialog({ isOpen: false, type: null, userId: null, userName: "", action: "" })
    },
    onError: (error) => {
      console.error('권한 변경 실패:', error)
      alert('권한 변경에 실패했습니다. 다시 시도해주세요.')
    }
  })

  // 계정 잠금 mutation
  const lockUserMutation = useMutation({
    mutationFn: adminService.lockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
      setConfirmDialog({ isOpen: false, type: null, userId: null, userName: "", action: "" })
    },
    onError: (error) => {
      console.error('계정 잠금 실패:', error)
      alert('계정 잠금에 실패했습니다. 다시 시도해주세요.')
    }
  })

  // 계정 잠금 해제 mutation
  const unlockUserMutation = useMutation({
    mutationFn: adminService.unlockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
      setConfirmDialog({ isOpen: false, type: null, userId: null, userName: "", action: "" })
    },
    onError: (error) => {
      console.error('계정 잠금 해제 실패:', error)
      alert('계정 잠금 해제에 실패했습니다. 다시 시도해주세요.')
    }
  })

  // 사용자 삭제 mutation
  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
      setConfirmDialog({ isOpen: false, type: null, userId: null, userName: "", action: "" })
    },
    onError: (error) => {
      console.error('사용자 삭제 실패:', error)
      alert('사용자 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  })

  // 필터링된 사용자 목록
  const filteredUsers = users.filter((user: UserDto) => {
    // 검색어 필터
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 역할 필터
    const matchesRole = roleFilter === "all" || 
                       (roleFilter === "admin" && user.role === USER_ROLES.ADMIN) ||
                       (roleFilter === "manager" && user.role === USER_ROLES.MANAGER) ||
                       (roleFilter === "user" && user.role === USER_ROLES.USER)
    
    // 상태 필터
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && !user.isLocked && !user.isDeleted) ||
                         (statusFilter === "locked" && user.isLocked && !user.isDeleted) ||
                         (statusFilter === "deleted" && user.isDeleted)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // MANAGER 권한 부여/해제 핸들러
  const handleManagerRoleToggle = (user: UserDto) => {
    if (user.id === currentUser?.id) {
      alert('자신의 권한은 변경할 수 없습니다.')
      return
    }

    const newRole = user.role === USER_ROLES.MANAGER ? USER_ROLES.USER : USER_ROLES.MANAGER
    const action = newRole === USER_ROLES.MANAGER ? '매니저 권한 부여' : '매니저 권한 해제'
    
    setConfirmDialog({
      isOpen: true,
      type: 'role',
      userId: user.id,
      userName: user.username,
      action
    })
  }

  // 계정 잠금 핸들러
  const handleLockToggle = (user: UserDto) => {
    if (user.id === currentUser?.id) {
      alert('자신의 계정은 잠금할 수 없습니다.')
      return
    }

    if (currentUser?.role === USER_ROLES.MANAGER && user.role === USER_ROLES.ADMIN) {
      alert('매니저는 운영자 계정을 잠금할 수 없습니다.')
      return
    }

    const action = user.isLocked ? '계정 잠금 해제' : '계정 잠금'
    
    setConfirmDialog({
      isOpen: true,
      type: 'lock',
      userId: user.id,
      userName: user.username,
      action
    })
  }

  // 사용자 삭제 핸들러
  const handleDeleteUser = (user: UserDto) => {
    if (user.id === currentUser?.id) {
      alert('자신의 계정은 삭제할 수 없습니다.')
      return
    }

    if (currentUser?.role === USER_ROLES.MANAGER && user.role === USER_ROLES.ADMIN) {
      alert('매니저는 운영자 계정을 삭제할 수 없습니다.')
      return
    }

    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      userId: user.id,
      userName: user.username,
      action: '사용자 삭제'
    })
  }

  // 확인 다이얼로그 실행
  const handleConfirmAction = () => {
    if (!confirmDialog.userId || !confirmDialog.type) return

    if (confirmDialog.type === 'role') {
      const user = users.find((u: UserDto) => u.id === confirmDialog.userId)
      if (user) {
        const newRole = user.role === USER_ROLES.MANAGER ? USER_ROLES.USER : USER_ROLES.MANAGER
        updateRoleMutation.mutate({ userId: confirmDialog.userId, role: newRole })
      }
    } else if (confirmDialog.type === 'lock') {
      const user = users.find((u: UserDto) => u.id === confirmDialog.userId)
      if (user) {
        if (user.isLocked) {
          unlockUserMutation.mutate(confirmDialog.userId)
        } else {
          lockUserMutation.mutate(confirmDialog.userId)
        }
      }
    } else if (confirmDialog.type === 'delete') {
      deleteUserMutation.mutate(confirmDialog.userId)
    }
  }

  const isActionLoading = updateRoleMutation.isPending || 
                         lockUserMutation.isPending || 
                         unlockUserMutation.isPending ||
                         deleteUserMutation.isPending

  if (isLoading) {
    return (
      <MainLayout activeRoute="/admin/users">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout activeRoute="/admin/users">
        <div className="text-center text-red-600 p-8">
          사용자 목록을 불러오는데 실패했습니다.
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/admin/users">
      <div className="space-y-6">
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              사용자 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 검색 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="사용자명 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* 역할 필터 */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="역할 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 역할</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="manager">매니저</SelectItem>
                  <SelectItem value="user">일반사용자</SelectItem>
                </SelectContent>
              </Select>
              
              {/* 상태 필터 */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="locked">잠금</SelectItem>
                  <SelectItem value="deleted">삭제됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 사용자 목록 테이블 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>사용자 목록 ({filteredUsers.length}명)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: UserDto) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileUrl || undefined} />
                            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <UserRoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isDeleted ? "outline" : user.isLocked ? "destructive" : "secondary"}>
                          {user.isDeleted ? "삭제됨" : user.isLocked ? "잠금" : "활성"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {/* MANAGER 권한 관리 버튼 (ADMIN만 볼 수 있음) */}
                          {currentUser?.role === USER_ROLES.ADMIN && user.role !== USER_ROLES.ADMIN && (
                            <Button
                              variant={user.role === USER_ROLES.MANAGER ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleManagerRoleToggle(user)}
                              disabled={user.id === currentUser?.id || isActionLoading || user.isDeleted}
                              className={user.role === USER_ROLES.MANAGER ? 
                                "text-blue-600 border-blue-200 hover:bg-blue-50" : 
                                "bg-blue-600 hover:bg-blue-700 text-white"
                              }
                            >
                              {user.role === USER_ROLES.MANAGER ? (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-1" />
                                  매니저 해제
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-1" />
                                  매니저 권한
                                </>
                              )}
                            </Button>
                          )}
                          
                          {/* 잠금 버튼 */}
                          <Button
                            variant={user.isLocked ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleLockToggle(user)}
                            disabled={
                              user.id === currentUser?.id || 
                              isActionLoading ||
                              user.isDeleted ||
                              (currentUser?.role === USER_ROLES.MANAGER && user.role === USER_ROLES.ADMIN)
                            }
                            className={user.isLocked ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {user.isLocked ? (
                              <>
                                <Unlock className="h-4 w-4 mr-1" />
                                잠금 해제
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                계정 잠금
                              </>
                            )}
                          </Button>

                          {/* 삭제 버튼 */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            disabled={
                              user.id === currentUser?.id || 
                              isActionLoading ||
                              user.isDeleted ||
                              (currentUser?.role === USER_ROLES.MANAGER && user.role === USER_ROLES.ADMIN)
                            }
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  조건에 맞는 사용자가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 확인 다이얼로그 */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        !isActionLoading && setConfirmDialog({ ...confirmDialog, isOpen: open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.action} 확인</DialogTitle>
            <DialogDescription>
              정말로 "{confirmDialog.userName}" 사용자의 {confirmDialog.action.toLowerCase()}를 진행하시겠습니까?
              <br />
              이 작업은 즉시 적용됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
              disabled={isActionLoading}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isActionLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}