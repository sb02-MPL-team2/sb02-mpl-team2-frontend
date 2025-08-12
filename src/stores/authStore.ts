import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, UserDto } from '@/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { tokenManager } from '@/lib/tokenManager';

/**
 * 인증 상태 관리 변경사항
 * 
 * 기존: 메모리 저장 + 새로고침 시 의도적 로그아웃 (보안 우선)
 * 변경: localStorage persist + 토큰 유효성 검증 (UX 개선)
 * 
 * 변경 이유:
 * - 새로고침 시 로그인 상태 유지 요구
 * - localStorage 백업으로 사용자 편의성 향상
 * 
 * 보안 고려사항:
 * - XSS 공격 시 localStorage 접근 가능 (위험 증가)
 * - initializeAuth()에서 토큰 유효성 검증으로 보완
 */

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDto) => void;
  setToken: (token: string) => void; // 토큰만 설정하는 메서드 추가
  clearAuth: () => void;
  initializeAuth: () => Promise<void>; // 앱 시작 시 토큰 자동 복원
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      // persist 미들웨어 적용으로 localStorage 자동 동기화
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
        // refresh token 방식에서 persist 토큰 검증 방식으로 변경
        set({ isLoading: true });
        
        // persist로 복원된 토큰이 있는지 확인
        const currentState = get();
        if (currentState.token && currentState.isAuthenticated) {
          try {
            // 토큰이 유효한지 사용자 정보로 검증
            const user = await userService.getMe();
            set({ user, isLoading: false });
          } catch (error) {
            // 토큰이 무효하면 로그아웃 (만료된 토큰 정리)
            console.log('저장된 토큰이 무효함:', error);
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
      };
    },
    {
      name: 'auth-storage', // localStorage 키 이름
      // 보안상 필요한 필드만 localStorage에 저장
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // isLoading은 제외 (휘발성 상태)
      }),
    }
  )
);