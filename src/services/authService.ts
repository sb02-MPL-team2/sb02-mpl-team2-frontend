import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { LoginRequest, LoginResponse, RefreshTokenResponse, SignupRequest, SignupResponse } from '@/types';

/**
 * 인증 관련 API 서비스
 * JWT 토큰 기반 인증 시스템을 위한 서비스 레이어
 */
export const authService = {
  /**
   * 사용자 로그인을 처리합니다
   * @param data 로그인 요청 데이터 (이메일, 비밀번호)
   * @returns 로그인 응답 (토큰만 반환 - 백엔드 미완성으로 임시 처리)
   * @throws API 에러 시 예외 발생
   * TODO: 백엔드에서 refreshToken, user 정보 추가 후 LoginResponse 타입 복원
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<string>(API_ENDPOINTS.AUTH_LOGIN, data);
    return { token: response.data };
  },

  /**
   * JWT 토큰을 갱신합니다
   * HttpOnly 쿠키의 리프레시 토큰을 사용하여 새로운 액세스 토큰을 얻습니다
   * @returns 새로운 액세스 토큰
   * @throws 리프레시 토큰이 만료되었거나 유효하지 않을 때 예외 발생
   */
  refresh: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<string>(API_ENDPOINTS.AUTH_REFRESH, {});
    return { token: response.data };
  },

  /**
   * 사용자 로그아웃을 처리합니다
   * 서버에 로그아웃 요청을 보내고, 클라이언트에서는 토큰을 제거해야 합니다
   * @throws API 에러 시 예외 발생
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },

  /**
   * 사용자 회원가입을 처리합니다
   * @param data 회원가입 요청 데이터 (이름, 이메일, 비밀번호)
   * @param profileImage 선택적 프로필 이미지 파일
   * @returns 생성된 사용자 정보
   * @throws API 에러 시 예외 발생
   */
  signup: async (data: SignupRequest, profileImage?: File): Promise<SignupResponse> => {
    const formData = new FormData();
    
    // Spring Boot의 @RequestPart를 위한 JSON Blob 생성
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('userCreateRequest', blob);
    
    if (profileImage) {
      formData.append('profile', profileImage);
    }
    const response = await apiClient.post<SignupResponse>(API_ENDPOINTS.AUTH_SIGNUP, formData);
    return response.data;
  },

  // 토큰 관리 메서드들이 제거됨
  // - 액세스 토큰: Zustand 메모리에서 관리
  // - 리프레시 토큰: HttpOnly 쿠키에서 관리
  // - 토큰 저장/제거는 각각 authStore와 서버에서 자동 처리
};