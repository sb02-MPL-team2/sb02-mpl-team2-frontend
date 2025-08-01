import apiClient from '@/lib/api';
import { UserDto, UserCreateRequest, UserUpdateRequest } from '@/types';

export const userService = {
  // 내 정보 조회
  getMe: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>('/users/me');
    return response.data;
  },

  // 전체 사용자 조회 (관리자용)
  getUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>('/users');
    return response.data;
  },

  // 특정 사용자 조회
  getUserById: async (userId: number): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>(`/users/${userId}`);
    return response.data;
  },

  // 회원가입
  createUser: async (data: UserCreateRequest, profileFile?: File): Promise<UserDto> => {
    const formData = new FormData();
    formData.append('userCreateRequest', JSON.stringify(data));
    if (profileFile) {
      formData.append('profile', profileFile);
    }

    const response = await apiClient.post<UserDto>('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 사용자 정보 수정
  updateUser: async (userId: number, data: UserUpdateRequest, profileFile?: File): Promise<UserDto> => {
    const formData = new FormData();
    formData.append('userUpdateRequest', JSON.stringify(data));
    if (profileFile) {
      formData.append('profile', profileFile);
    }

    const response = await apiClient.put<UserDto>(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 회원 탈퇴
  deleteMyAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },
};