import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  /** 보호할 컴포넌트 */
  children: React.ReactNode
  /** 관리자 권한이 필요한 페이지인지 여부 (기본값: false) */
  requireAdmin?: boolean
}

/**
 * 보호된 라우트 컴포넌트
 * 
 * 주요 기능:
 * 1. 사용자 인증 상태 확인
 * 2. 미인증 사용자를 로그인 페이지로 리다이렉트
 * 3. 관리자 권한이 필요한 페이지에 대한 접근 제어
 * 4. 토큰은 있지만 사용자 정보가 없는 경우 자동 초기화
 * 
 * @param children 렌더링할 자식 컴포넌트
 * @param requireAdmin 관리자 권한 필요 여부 (기본값: false)
 */
export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  // 현재 위치를 state로 전달하여 로그인 후 원래 페이지로 돌아갈 수 있도록 함
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 관리자 권한이 필요한데 일반 사용자인 경우 404 페이지로 리다이렉트
  // 실제 프로덕션에서는 403 Forbidden 페이지를 별도로 만드는 것이 좋음
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/404" replace />
  }

  return <>{children}</>
}