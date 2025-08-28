import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { authService } from "@/services/authService"
import { userService } from "@/services/userService"

/**
 * OAuth2 콜백 처리 페이지
 * 소셜 OAuth2 인증 완료 후 백엔드에서 리다이렉트되는 페이지입니다.
 * 성공/실패 상태를 확인하고 적절한 처리를 수행합니다.
 */
export default function OAuth2CallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  
  const { setToken, setUser } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🚀 OAuth2 콜백 페이지 진입:', window.location.href)
        console.log('📋 URL 파라미터:', Object.fromEntries(searchParams.entries()))
        console.log('🍪 현재 쿠키:', document.cookie)
        
        // Docker 환경 디버깅 정보 추가
        console.log('🐳 Docker 환경 쿠키 디버깅')
        console.log('현재 도메인:', window.location.hostname)
        console.log('현재 포트:', window.location.port)
        console.log('현재 프로토콜:', window.location.protocol)
        console.log('refresh_token 쿠키 존재:', document.cookie.includes('refresh_token'))
        
        // 쿠키 파싱해서 refresh_token 확인
        const cookies = document.cookie.split(';').map(c => c.trim())
        const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='))
        console.log('refresh_token 쿠키 값:', refreshTokenCookie ? '존재함' : '없음')

        // URL 파라미터에서 에러 확인
        const error = searchParams.get('error')
        if (error) {
          console.error('❌ OAuth2 에러 파라미터 발견:', error)
          setStatus('error')
          setErrorMessage(decodeURIComponent(error) || 'OAuth2 로그인 중 오류가 발생했습니다.')
          return
        }

        console.log('🔄 토큰 갱신 시작...')
        // 백엔드에서 이미 JWT를 HttpOnly 쿠키로 설정했을 것이므로
        // refresh 엔드포인트를 호출하여 액세스 토큰을 얻습니다
        const tokenResponse = await authService.refresh()
        console.log('✅ 토큰 갱신 성공:', tokenResponse)
        const { token } = tokenResponse

        // 토큰 설정
        console.log('💾 토큰 상태 저장 중...')
        setToken(token)

        // 사용자 정보 가져오기
        console.log('👤 사용자 정보 조회 중...')
        const user = await userService.getMe()
        console.log('✅ 사용자 정보 조회 성공:', user)
        setUser(user)

        setStatus('success')
        console.log('🎉 OAuth2 로그인 완료! 1.5초 후 메인 페이지로 이동...')
        
        // 1.5초 후 메인 페이지로 리다이렉트
        setTimeout(() => {
          navigate('/contents', { replace: true })
        }, 1500)

      } catch (error: any) {
        console.error('💥 OAuth2 콜백 처리 중 에러 발생:', error)
        console.error('📊 에러 상세 정보:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        })
        setStatus('error')
        setErrorMessage(
          error.response?.data?.message || 
          error.message || 
          'OAuth2 로그인 처리 중 오류가 발생했습니다.'
        )
      }
    }

    handleCallback()
  }, [searchParams, navigate, setToken, setUser])

  const handleRetryLogin = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && '소셜 로그인 처리 중...'}
            {status === 'success' && '소셜 로그인 성공!'}
            {status === 'error' && '소셜 로그인 실패'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600 text-center">
                로그인 정보를 확인하고 있습니다...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  소셜 로그인이 성공적으로 완료되었습니다.
                  잠시 후 메인 페이지로 이동합니다.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleRetryLogin}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                로그인 페이지로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}