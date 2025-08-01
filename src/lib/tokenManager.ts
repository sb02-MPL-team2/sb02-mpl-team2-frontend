/**
 * 토큰 관리를 위한 유틸리티
 * 순환 참조를 방지하기 위해 별도 파일로 분리
 */

let tokenGetter: (() => string | null) | null = null;
let tokenSetter: ((token: string) => void) | null = null;
let authClearer: (() => void) | null = null;

export const tokenManager = {
  /**
   * 토큰 getter/setter 함수 등록
   * authStore에서 초기화 시 호출
   */
  init(
    getToken: () => string | null,
    setToken: (token: string) => void,
    clearAuth: () => void
  ) {
    tokenGetter = getToken;
    tokenSetter = setToken;
    authClearer = clearAuth;
  },

  /**
   * 현재 토큰 가져오기
   */
  getToken(): string | null {
    return tokenGetter?.() ?? null;
  },

  /**
   * 토큰 설정
   */
  setToken(token: string) {
    tokenSetter?.(token);
  },

  /**
   * 인증 정보 초기화
   */
  clearAuth() {
    authClearer?.();
  },
};