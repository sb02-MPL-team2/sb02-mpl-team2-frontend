import { UserSlimDto } from './auth';

// Content related types
export interface ContentResponseDto {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  totalRating: number;
  reviewCount: number;
  watchCount: number;
  createdAt?: string;
  roomId?: number | null;
}

// Alias for convenience
export type Content = ContentResponseDto;

export interface ContentState {
  contents: ContentResponseDto[];
  selectedContent: ContentResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

// Review related types
export interface ReviewDto {
  id: number;
  content: ContentResponseDto;
  author: UserSlimDto;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewCreateRequest {
  userId: number;
  contentId: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdateRequest {
  newRating?: number;
  newComment?: string;
}

export interface ReviewState {
  reviews: ReviewDto[];
  isLoading: boolean;
  error: string | null;
}