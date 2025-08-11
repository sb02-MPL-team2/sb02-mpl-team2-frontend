import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// Import components
import LoginPage from '@/pages/login-page'
import SignupPage from '@/pages/signup-page'
import NotFoundPage from '@/pages/not-found-page'
import DashboardPage from '@/pages/dashboard-page'
import WatchPageWrapper from '@/pages/watch-page-wrapper'
import ReviewPageWrapper from '@/pages/review-page-wrapper'
import PlaylistsPage from '@/pages/playlists-page'
import PlaylistDetailPageWrapper from '@/pages/playlist-detail-page-wrapper'
import ProfilesPage from '@/pages/profiles-page'
import UserProfileDetailPageWrapper from '@/pages/user-profile-detail-page-wrapper'
import ProfileEditPage from '@/pages/profile-edit-page'
import ChatPageWrapper from '@/pages/chat-page-wrapper'
import UserManagementPage from '@/pages/user-management-page'
import ProtectedRoute from '@/components/protected-route'

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
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/watch/:contentId",
    element: (
      <ProtectedRoute>
        <WatchPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: "/review/:contentId",
    element: (
      <ProtectedRoute>
        <ReviewPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: "/playlists",
    element: (
      <ProtectedRoute>
        <PlaylistsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/playlist/:playlistId",
    element: (
      <ProtectedRoute>
        <PlaylistDetailPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profiles",
    element: (
      <ProtectedRoute>
        <ProfilesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <UserProfileDetailPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <ProfileEditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:userId",
    element: (
      <ProtectedRoute>
        <ChatPageWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requireAdmin>
        <UserManagementPage />
      </ProtectedRoute>
    ),
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

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // 앱 시작 시 한 번만 토큰 자동 복원 시도
    initializeAuth();
  }, []); // 종속성 배열 제거 - 앱 시작 시 한 번만 실행

  return <RouterProvider router={router} />
}