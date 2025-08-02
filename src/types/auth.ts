// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
}

export interface RefreshTokenRequest {
  refreshToken: string;
} 

export interface RefreshTokenResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  profileUrl: string;
  role: 'ADMIN' | 'USER';
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// User DTO from backend
export interface UserDto {
  id: number;
  username: string;
  email: string;
  profileUrl: string;
  followerCount: number;
  followingCount: number;
  role: 'ADMIN' | 'USER';
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSlimDto {
  id: number;
  username: string;
  profileUrl: string;
}