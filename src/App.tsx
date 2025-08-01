import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Import components
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import NotFoundPage from '@/pages/NotFoundPage'
import DashboardPage from '@/pages/DashboardPage'
import WatchPageWrapper from '@/pages/WatchPageWrapper'
import ReviewPageWrapper from '@/pages/ReviewPageWrapper'
import PlaylistsPage from '@/pages/PlaylistsPage'
import PlaylistDetailPageWrapper from '@/pages/PlaylistDetailPageWrapper'
import ProfilesPage from '@/pages/ProfilesPage'
import UserProfileDetailPageWrapper from '@/pages/UserProfileDetailPageWrapper'
import ProfileEditPage from '@/pages/ProfileEditPage'
import ChatPageWrapper from '@/pages/ChatPageWrapper'
import UserManagementPage from '@/pages/UserManagementPage'
import ProtectedRoute from '@/components/ProtectedRoute'

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

  return <RouterProvider router={router} />
}