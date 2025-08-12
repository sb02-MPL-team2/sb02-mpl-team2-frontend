import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { UserDto } from '@/types';

/**
 * 관리자 관련 API 서비스
 * 사용자 관리, 권한 관리 등의 관리자 전용 기능을 제공
 */
export const adminService = {
  /**
   * 모든 사용자 목록 조회 (관리자 전용)
   * @returns 모든 사용자 정보 목록
   * @throws 권한이 없거나 API 에러 시 예외 발생
   */
  getAllUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.USERS);
    return response.data;
  },

  /**
   * 사용자 계정 잠금
   * @param userId 잠금할 사용자 ID
   * @throws 권한이 없거나 API 에러 시 예외 발생
   */
  lockUser: async (userId: number): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ADMIN_LOCK_USER(userId));
  },

  /**
   * 사용자 계정 잠금 해제
   * @param userId 잠금 해제할 사용자 ID
   * @throws 권한이 없거나 API 에러 시 예외 발생
   */
  unlockUser: async (userId: number): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ADMIN_UNLOCK_USER(userId));
  },

  /**
   * 사용자 권한 변경 (관리자 ↔ 일반사용자)
   * @param userId 권한을 변경할 사용자 ID
   * @param role 새로운 역할 ('ADMIN' | 'MANAGER' | 'USER')
   * @returns 업데이트된 사용자 정보
   * @throws 권한이 없거나 API 에러 시 예외 발생
   */
  updateUserRole: async (userId: number, role: 'ADMIN' | 'MANAGER' | 'USER'): Promise<UserDto> => {
    const response = await apiClient.put<UserDto>(API_ENDPOINTS.ADMIN_UPDATE_ROLE(userId), { role });
    return response.data;
  },

  /**
   * 사용자 삭제 (관리자 전용)
   * @param userId 삭제할 사용자 ID
   * @throws 권한이 없거나 API 에러 시 예외 발생
   */
  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
  },
};