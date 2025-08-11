import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { tokenManager } from '@/lib/tokenManager';

/**
 * Axios 클라이언트 인스턴스
 * 모든 API 요청에 공통으로 사용되는 설정을 포함
 * - JWT 토큰 자동 첨부
 * - 토큰 만료 시 자동 갱신
 * - 에러 처리 및 리다이렉트
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터 - 모든 API 요청에 JWT 토큰을 자동으로 첨부
 * Zustand 스토어에서 토큰을 가져와 Authorization 헤더에 추가
 * 쿠키 전송을 위해 withCredentials 설정
 */
apiClient.interceptors.request.use(
  (config) => {
    // 인증이 필요 없는 엔드포인트는 토큰을 첨부하지 않음
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/signup');
    
    if (!isAuthEndpoint) {
      // tokenManager에서 토큰 가져오기
      const token = tokenManager.getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // FormData인 경우 Content-Type을 제거하여 브라우저가 자동으로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // 쿠키 전송을 위한 withCredentials 설정
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 에러 처리 및 JWT 토큰 자동 갱신
 * 
 * 주요 기능:
 * 1. 401 Unauthorized 에러 시 리프레시 토큰(쿠키)으로 자동 토큰 갱신
 * 2. 토큰 갱신 실패 시 로그인 페이지로 자동 리다이렉트
 * 3. 갱신된 토큰으로 원래 요청 재시도
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 인증 관련 요청인 경우 토큰 갱신 시도하지 않음
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup')) {
      return Promise.reject(error);
    }

    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        const newToken = response.data; // 백엔드에서 토큰 문자열 직접 반환
        tokenManager.setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenManager.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;