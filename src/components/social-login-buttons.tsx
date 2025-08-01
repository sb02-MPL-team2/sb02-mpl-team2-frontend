import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

/**
 * 소셜 로그인 버튼 컴포넌트
 * Google과 Kakao 로그인 버튼을 제공합니다.
 * 현재는 /404로 리다이렉트되며, 추후 실제 소셜 로그인 기능으로 대체될 예정입니다.
 */
export default function SocialLoginButtons() {
  return (
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
  )
}