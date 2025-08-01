"use client"

import type React from "react"
import { useRef, useState } from "react"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default function ProfileEditPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string>("")
  const [newPassword, setNewPassword] = useState("")

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarSrc(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 비밀번호 변경 로직이 여기에 추가될 예정
    console.log("Password change submitted:", newPassword)
    // 성공 시 비밀번호 필드 초기화
    setNewPassword("")
    alert("비밀번호가 성공적으로 변경되었습니다.")
  }

  return (
    <MainLayout activeRoute="/profile">
      <div className="space-y-6 max-w-2xl">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">프로필 수정</h2>
          <p className="text-gray-600 mt-2">프로필 정보를 수정하고 관리하세요.</p>
        </div>

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
              <div className="space-y-2">
                <Button onClick={handleImageUpload} className="bg-purple-600 hover:bg-purple-700">
                  새 이미지 업로드
                </Button>
                <p className="text-sm text-gray-500">JPG, PNG 파일을 업로드하세요.</p>
              </div>
            </div>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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
                  required
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                비밀번호 변경
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}