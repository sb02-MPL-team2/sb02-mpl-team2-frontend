import { UserDto, UserSlimDto } from './auth';

// User related types
export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  newUsername?: string;
  newEmail?: string;
  newPassword?: string;
}

export interface UserProfileUpdateData {
  userUpdateRequest: UserUpdateRequest;
  profile?: File;
}

export interface UserState {
  users: UserDto[];
  currentUser: UserDto | null;
  isLoading: boolean;
  error: string | null;
}

// Re-export for convenience
export type { UserDto, UserSlimDto };