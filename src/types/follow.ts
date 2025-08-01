import { UserSlimDto } from './auth';

// Follow related types
export interface FollowRequest {
  fromUserId: number;
}

export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean;
  relationship: 'mutual' | 'following' | 'follower' | 'none';
}

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