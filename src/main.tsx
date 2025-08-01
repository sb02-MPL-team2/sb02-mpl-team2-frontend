import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'

// Import components
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import WatchPageWrapper from './pages/WatchPageWrapper'
import ReviewPageWrapper from './pages/ReviewPageWrapper'
import PlaylistsPage from './pages/PlaylistsPage'
import PlaylistDetailPageWrapper from './pages/PlaylistDetailPageWrapper'
import ProfilesPage from './pages/ProfilesPage'
import UserProfileDetailPageWrapper from './pages/UserProfileDetailPageWrapper'
import ProfileEditPage from './pages/ProfileEditPage'
import ChatPageWrapper from './pages/ChatPageWrapper'
import UserManagementPage from './pages/UserManagementPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/contents",
    element: <DashboardPage />,
  },
  {
    path: "/watch/:contentId",
    element: <WatchPageWrapper />,
  },
  {
    path: "/review/:contentId",
    element: <ReviewPageWrapper />,
  },
  {
    path: "/playlists",
    element: <PlaylistsPage />,
  },
  {
    path: "/playlist/:playlistId",
    element: <PlaylistDetailPageWrapper />,
  },
  {
    path: "/profiles",
    element: <ProfilesPage />,
  },
  {
    path: "/profile/:userId",
    element: <UserProfileDetailPageWrapper />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEditPage />,
  },
  {
    path: "/chat/:userId",
    element: <ChatPageWrapper />,
  },
  {
    path: "/admin/users",
    element: <UserManagementPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])

// React Query Client 설정 (백엔드 테스트용 - 캐싱 최소화)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 예시: 1분
      gcTime: 1000 * 60 * 5, // 5분 후 캐시 삭제 (완전히 0으로 하면 성능 문제)
      refetchOnMount: true,      // 컴포넌트 마운트 시마다 새로 요청
      refetchOnWindowFocus: true, // 윈도우 포커스 시마다 새로 요청
      refetchOnReconnect: true,  // 네트워크 재연결 시 새로 요청
      retry: 1,                  // 실패 시 1번만 재시도 (빠른 에러 확인)
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* 개발 환경에서만 React Query DevTools 표시 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)