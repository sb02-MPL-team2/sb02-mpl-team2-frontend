import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { UserDto, UserCreateRequest, UserUpdateRequest } from '@/types';

export const userService = {
  // 내 정보 조회
  getMe: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>(API_ENDPOINTS.USERS_ME);
    return response.data;
  },

  // 전체 사용자 조회 (관리자용)
  getUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.USERS);
    return response.data;
  },

  // 특정 사용자 조회
  getUserById: async (userId: number): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>(API_ENDPOINTS.USER_BY_ID(userId));
    return response.data;
  },


  // 사용자 정보 수정
  updateUser: async (userId: number, data: UserUpdateRequest, profileFile?: File): Promise<UserDto> => {
    const formData = new FormData();
    
    // Spring Boot의 @RequestPart를 위한 JSON Blob 생성 (회원가입 API와 동일한 방식)
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('userUpdateRequest', blob);
    
    if (profileFile) {
      formData.append('profile', profileFile);
    }

    const response = await apiClient.put<UserDto>(API_ENDPOINTS.USER_BY_ID(userId), formData);
    return response.data;
  },

  // 회원 탈퇴 (내 계정 삭제)
  deleteMyAccount: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS_ME);
  },

  // 특정 사용자 삭제 (관리자용)
  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
  },
};