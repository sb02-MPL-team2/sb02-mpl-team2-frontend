import { UserSlimDto } from './auth';

// Follow related types
export interface FollowRequest {
  fromUserId: number;
}

// 백엔드 API 스펙에 맞는 팔로우 응답 타입
export interface FollowResponse {
  followeeId: number;
  followerId: number;
}

// 백엔드 API 스펙에 맞는 팔로우 상태 응답 타입
export interface FollowStatusResponse {
  isFollowing: boolean;
  followeeId: number;
  followerId: number;
}

// 기존 팔로우 상태 (프론트엔드 내부용)
export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean;
  relationship: 'mutual' | 'following' | 'follower' | 'none';
}

// 백엔드 API 스펙에 맞는 팔로워/팔로잉 사용자 타입
export interface FollowUserDto {
  id: number;
  profileUrl: string | null;
  username: string;
}

// 백엔드 API 스펙에 맞는 팔로워/팔로잉 목록 응답 타입
export interface FollowListResponse {
  userList: FollowUserDto[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 기존 타입들 (호환성을 위해 유지)
export interface FollowerUserDto extends UserSlimDto {
  followedAt: string;
}

export interface FollowingUserDto extends UserSlimDto {
  followedAt: string;
}

export interface FollowState {
  followers: FollowerUserDto[];
  following: FollowingUserDto[];
  followStatus: Record<number, FollowStatus>; // userId -> status
  isLoading: boolean;
  error: string | null;
}