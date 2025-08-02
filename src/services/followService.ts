import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { UserDto } from '@/types';

/**
 * 팔로우 관련 API 서비스
 * 사용자 간의 팔로우/언팔로우 및 팔로워/팔로잉 관리
 */
export const followService = {
  /**
   * 사용자 팔로우
   * @param userId 팔로우할 사용자 ID
   * @throws 이미 팔로우 중이거나 API 에러 시 예외 발생
   */
  followUser: async (userId: number): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.FOLLOW_USER(userId));
  },

  /**
   * 사용자 언팔로우
   * @param userId 언팔로우할 사용자 ID
   * @throws API 에러 시 예외 발생
   */
  unfollowUser: async (userId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FOLLOW_USER(userId));
  },

  /**
   * 팔로우 상태 확인
   * @param userId 확인할 사용자 ID
   * @returns 팔로우 여부 (true/false)
   */
  getFollowStatus: async (userId: number): Promise<{ isFollowing: boolean }> => {
    const response = await apiClient.get<{ isFollowing: boolean }>(API_ENDPOINTS.FOLLOW_STATUS(userId));
    return response.data;
  },

  /**
   * 특정 사용자의 팔로워 목록 조회
   * @param userId 사용자 ID
   * @returns 팔로워 목록
   */
  getFollowers: async (userId: number): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.FOLLOWERS(userId));
    return response.data;
  },

  /**
   * 특정 사용자의 팔로잉 목록 조회
   * @param userId 사용자 ID
   * @returns 팔로잉 목록
   */
  getFollowing: async (userId: number): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.FOLLOWING(userId));
    return response.data;
  },
};