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
      refreshToken: null,
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
            refreshToken: null, // 쿠키로 관리되므로 사용하지 않음
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
            refreshToken: null,
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
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
  };
});