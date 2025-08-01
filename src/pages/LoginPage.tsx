"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

import { useAuthStore } from "@/stores/authStore"
import SocialLoginButtons from "@/components/SocialLoginButtons"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuthStore()

  // 회원가입 완료 메시지 확인
  useEffect(() => {
    const message = location.state?.message
    if (message) {
      setSuccessMessage(message)
    }
  }, [location])

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/contents", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      navigate("/contents")
    } catch (error: any) {
      console.error("Login failed:", error)
      setError(error.response?.data?.message || "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email and Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* Helper Links */}
          <div className="flex flex-col space-y-2 text-sm text-center">
            <Link to="/404" className="text-gray-600 hover:text-gray-800 hover:underline">
              비밀번호를 잊어버리셨나요?
            </Link>
            <Link to="/signup" className="text-purple-600 hover:text-purple-800 hover:underline">
              계정이 없으신가요? 회원가입
            </Link>
          </div>

          {/* Social Logins */}
          <div className="space-y-4">
            <Separator />
            <SocialLoginButtons />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}