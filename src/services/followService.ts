import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';

/**
 * 팔로우/언팔로우 응답 타입
 */
export interface FollowResponse {
  followeeId: number;
  followerId: number;
}

/**
 * 팔로우 상태 확인 응답 타입
 */
export interface FollowStatusResponse {
  isFollowing: boolean;
  followeeId: number;
  followerId: number;
}

/**
 * 팔로워/팔로잉 목록 사용자 타입
 */
export interface FollowUserDto {
  id: number;
  profileUrl: string | null;
  username: string;
}

/**
 * 팔로워/팔로잉 목록 응답 타입
 */
export interface FollowListResponse {
  userList: FollowUserDto[];
  nextCursor: number | null;
  hasNext: boolean;
}

/**
 * 팔로우 관련 API 서비스
 * 사용자 간의 팔로우/언팔로우 및 팔로워/팔로잉 관리
 */
export const followService = {
  /**
   * 사용자 팔로우
   * @param followeeId 팔로우할 사용자 ID
   * @returns 팔로우 응답 데이터
   */
  followUser: async (followeeId: number): Promise<FollowResponse> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await apiClient.post<FollowResponse>(
      API_ENDPOINTS.FOLLOW_USER(followeeId),
      null,
      {
        params: {
          followerId: currentUser.id
        }
      }
    );
    return response.data;
  },

  /**
   * 사용자 언팔로우
   * @param followeeId 언팔로우할 사용자 ID
   * @returns 언팔로우 응답 데이터
   */
  unfollowUser: async (followeeId: number): Promise<FollowResponse> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await apiClient.delete<FollowResponse>(
      API_ENDPOINTS.FOLLOW_USER(followeeId),
      {
        params: {
          followerId: currentUser.id
        }
      }
    );
    return response.data;
  },

  /**
   * 팔로우 상태 확인
   * @param followeeId 확인할 사용자 ID
   * @returns 팔로우 상태
   */
  getFollowStatus: async (followeeId: number): Promise<FollowStatusResponse> => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await apiClient.get<FollowStatusResponse>(
      API_ENDPOINTS.FOLLOW_STATUS(followeeId),
      {
        params: {
          followerId: currentUser.id
        }
      }
    );
    return response.data;
  },

  /**
   * 특정 사용자의 팔로워 목록 조회
   * @param userId 사용자 ID
   * @param cursor 페이징 커서 (선택사항)
   * @param size 조회할 데이터 개수 (기본값: 20)
   * @returns 팔로워 목록
   */
  getFollowers: async (
    userId: number,
    cursor?: number,
    size: number = 20
  ): Promise<FollowListResponse> => {
    const params: Record<string, any> = { size };
    if (cursor !== undefined) {
      params.cursor = cursor;
    }
    
    const response = await apiClient.get<FollowListResponse>(
      API_ENDPOINTS.FOLLOWERS(userId),
      { params }
    );
    return response.data;
  },

  /**
   * 특정 사용자의 팔로잉 목록 조회
   * @param userId 사용자 ID
   * @param cursor 페이징 커서 (선택사항)
   * @param size 조회할 데이터 개수 (기본값: 20)
   * @returns 팔로잉 목록
   */
  getFollowing: async (
    userId: number,
    cursor?: number,
    size: number = 20
  ): Promise<FollowListResponse> => {
    const params: Record<string, any> = { size };
    if (cursor !== undefined) {
      params.cursor = cursor;
    }
    
    const response = await apiClient.get<FollowListResponse>(
      API_ENDPOINTS.FOLLOWING(userId),
      { params }
    );
    return response.data;
  },
};