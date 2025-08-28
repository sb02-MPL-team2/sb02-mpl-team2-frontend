import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OAUTH2_ENDPOINTS } from "@/lib/constants"

/**
 * 소셜 로그인 버튼 컴포넌트
 * Google과 Kakao 로그인 버튼을 제공합니다.
 * 두 플랫폼 모두 실제 OAuth2 플로우로 구현되어 있습니다.
 */
export default function SocialLoginButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    // OAuth2 플로우 시작 - 백엔드 엔드포인트로 리다이렉트
    window.location.href = OAUTH2_ENDPOINTS.GOOGLE
  }

  const handleKakaoLogin = () => {
    setIsKakaoLoading(true)
    // OAuth2 플로우 시작 - 백엔드 엔드포인트로 리다이렉트
    window.location.href = OAUTH2_ENDPOINTS.KAKAO
  }

  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-3 bg-transparent"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          // 로딩 스피너
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          // Google Logo SVG
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
        )}
        {isGoogleLoading ? "로그인 중..." : "Google로 계속하기"}
      </Button>

      <Button 
        variant="outline" 
        className="w-full flex items-center gap-3 bg-transparent"
        onClick={handleKakaoLogin}
        disabled={isKakaoLoading}
      >
        {isKakaoLoading ? (
          // 로딩 스피너
          <div className="w-4 h-4 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
        ) : (
          // Kakao Logo SVG (공식 브랜드 가이드라인 준수)
          <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
            <path
              fill="#000000"
              d="M12 3c-5.799 0-10.5 3.664-10.5 8.199 0 2.816 1.753 5.297 4.385 6.797-.187.692-.681 2.553-.766 2.877-.101.384.139.377.278.274.109-.08 1.896-1.28 3.238-2.154.455.043.926.065 1.405.065 5.799 0 10.5-3.664 10.5-8.199S17.799 3 12 3z"
            />
          </svg>
        )}
        {isKakaoLoading ? "로그인 중..." : "Kakao로 계속하기"}
      </Button>
    </div>
  )
}