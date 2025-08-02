"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserRoleBadge } from "@/components/user-role-badge"
import { User, AlertCircle } from "lucide-react"
import { userService } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"

export default function ProfileEditPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  
  const { user, setUser } = useAuthStore()
  const queryClient = useQueryClient()

  // 현재 사용자 정보 조회
  const { data: currentUser, isLoading, error: userError } = useQuery({
    queryKey: QUERY_KEYS.USER_ME,
    queryFn: userService.getMe,
    enabled: !!user?.id
  })

  // 사용자 정보가 로드되면 상태 초기화
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setAvatarSrc(currentUser.profileUrl || "")
    }
  }, [currentUser])

  // 프로필 업데이트 mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { username?: string; password?: string; profileFile?: File }) => {
      if (!currentUser) throw new Error('사용자 정보가 없습니다')
      return userService.updateUser(currentUser.id, {
        newUsername: data.username,
        newPassword: data.password
      }, data.profileFile)
    },
    onSuccess: (updatedUser) => {
      // 전역 상태 업데이트
      setUser(updatedUser)
      // 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ME })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BY_ID(updatedUser.id) })
      
      // 이미지 업로드 완료 시 선택된 파일 초기화
      setSelectedFile(null)
      
      setSuccessMessage("프로필이 성공적으로 업데이트되었습니다.")
      setError("")
      
      // 성공 메시지 3초 후 제거
      setTimeout(() => setSuccessMessage(""), 3000)
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "프로필 업데이트에 실패했습니다.")
      setSuccessMessage("")
    }
  })

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarSrc(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("닉네임을 입력해주세요.")
      return
    }
    updateProfileMutation.mutate({ username: username.trim() })
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newPassword.trim()) {
      setError("새 비밀번호를 입력해주세요.")
      return
    }
    updateProfileMutation.mutate({ password: newPassword.trim() })
    setNewPassword("")
  }

  const handleImageSubmit = () => {
    if (selectedFile) {
      updateProfileMutation.mutate({ profileFile: selectedFile })
    }
  }

  if (isLoading) {
    return (
      <MainLayout activeRoute="/profile">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">프로필 정보를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  if (userError) {
    return (
      <MainLayout activeRoute="/profile">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500">프로필 정보를 불러오는데 실패했습니다.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/profile">
      <div className="space-y-6 max-w-2xl">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">프로필 수정</h2>
          <p className="text-gray-600 mt-2">프로필 정보를 수정하고 관리하세요.</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>현재 프로필 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser?.profileUrl || ""} alt="현재 프로필 이미지" />
                <AvatarFallback className="bg-purple-100">
                  <User className="h-8 w-8 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-sm text-gray-600">{currentUser?.email}</p>
                <div className="flex items-center gap-2">
                  {currentUser?.role && <UserRoleBadge role={currentUser.role} />}
                </div>
                <p className="text-xs text-gray-500">
                  가입일: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('ko-KR') : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 이미지 변경</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="프로필 이미지" />
                <AvatarFallback className="bg-purple-100">
                  <User className="h-12 w-12 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleImageUpload} 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={updateProfileMutation.isPending}
                  >
                    새 이미지 업로드
                  </Button>
                  {selectedFile && (
                    <Button 
                      onClick={handleImageSubmit}
                      variant="outline"
                      disabled={updateProfileMutation.isPending}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      {updateProfileMutation.isPending ? "저장 중..." : "이미지 저장"}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500">JPG, PNG 파일을 업로드하세요.</p>
              </div>
            </div>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </CardContent>
        </Card>

        {/* Username Change Section */}
        <Card>
          <CardHeader>
            <CardTitle>닉네임 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">새 닉네임</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="새 닉네임을 입력하세요"
                  disabled={updateProfileMutation.isPending}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "변경 중..." : "닉네임 변경"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  disabled={updateProfileMutation.isPending}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}