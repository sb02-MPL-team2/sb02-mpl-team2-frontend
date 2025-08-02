"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, User, Upload } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    if (!email || !username || !password) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      const signupData = { email, username, password }
      await authService.signup(signupData, selectedFile || undefined)
      
      navigate("/login", { 
        state: { message: "회원가입이 완료되었습니다. 로그인해주세요." } 
      })
    } catch (error: any) {
      console.error("Signup failed:", error)
      setError(error.response?.data?.message || "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sign-up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Image Section */}
            <div className="space-y-2">
              <Label>프로필 이미지 (선택사항)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl || "/placeholder.svg"} alt="프로필 미리보기" />
                  <AvatarFallback className="bg-purple-100">
                    <User className="h-10 w-10 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button 
                    type="button"
                    onClick={handleImageUpload}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFile ? "다른 이미지 선택" : "이미지 선택"}
                  </Button>
                  {selectedFile ? (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {selectedFile.name} 선택됨
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일을 업로드하세요.</p>
                  )}
                </div>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="이메일을 입력하세요" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="이름을 입력하세요" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "가입 중..." : "가입하기"}
            </Button>
          </form>

          {/* Helper Link */}
          <div className="text-sm text-center">
            <Link to="/login" className="text-purple-600 hover:text-purple-800 hover:underline">
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>

          {/* Social Logins */}
          <div className="space-y-4">
            <Separator />
            <div className="space-y-3">
              <Link to="/404" className="block">
                <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
                  {/* Google Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 계속하기
                </Button>
              </Link>

              <Link to="/404" className="block">
                <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
                  {/* Kakao Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path
                      fill="#FEE500"
                      d="M12 3C7.03 3 3 6.14 3 10.1c0 2.52 1.65 4.74 4.1 6.05l-.95 3.46c-.08.29.22.52.48.37L10.97 17c.34.02.68.03 1.03.03 4.97 0 9-3.14 9-7.1S16.97 3 12 3z"
                    />
                    <ellipse fill="#3C1E1E" cx="12" cy="10.1" rx="6" ry="4.1" />
                  </svg>
                  Kakao로 계속하기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}