import { create } from 'zustand';
import { AuthState, UserDto } from '@/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { tokenManager } from '@/lib/tokenManager';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDto) => void;
  setToken: (token: string) => void; // 토큰만 설정하는 메서드 추가
  clearAuth: () => void;
  initializeAuth: () => Promise<void>; // 앱 시작 시 토큰 자동 복원
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // tokenManager 초기화
  tokenManager.init(
    () => get().token,
    (token) => get().setToken(token),
    () => get().clearAuth()
  );

  return {
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          const { token } = response; // 백엔드에서 토큰만 반환

          // 토큰 설정 후 사용자 정보 가져오기
          set({
            token, // 메모리에만 저장
            isAuthenticated: true,
          });

          // 사용자 정보 가져오기
          const user = await userService.getMe();
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            token: null, // 메모리에서 제거
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: UserDto) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      clearAuth: () => {
        set({
          token: null, // 메모리에서만 제거
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initializeAuth: async () => {
        // 현재 경로가 로그인 관련 페이지인 경우 토큰 복원 시도하지 않음
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          // 쿠키에 refresh token이 있는지 확인하고 토큰 갱신 시도
          const response = await authService.refresh();
          const { token } = response; // 백엔드에서 새로운 access token 반환
          
          // 토큰 설정 후 사용자 정보 가져오기
          set({
            token,
            isAuthenticated: true,
          });

          // 사용자 정보 가져오기
          const user = await userService.getMe();
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          // 토큰 갱신 실패 시 (쿠키 없거나 만료됨) - 로그아웃 상태로 유지
          console.log('자동 토큰 복원 실패:', error);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
  };
});