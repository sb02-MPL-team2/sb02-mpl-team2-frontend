// Common API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  status: number;
  timestamp: string;
  message: string;
  details: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface CursorPageResponse<T> {
  content: T[];
  nextCursor: any;
  size: number;
  hasNext: boolean;
}

// Role update for admin
export interface RoleUpdateRequest {
  role: 'ADMIN' | 'USER';
}