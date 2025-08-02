import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { ReviewDto, ReviewCreateRequest } from '@/types';

export const reviewService = {
  // 특정 콘텐츠의 리뷰 목록 조회
  getReviewsByContentId: async (contentId: number): Promise<ReviewDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS_BY_CONTENT(contentId));
    return response.data;
  },

  // 리뷰 작성
  createReview: async (data: ReviewCreateRequest): Promise<ReviewDto> => {
    const response = await apiClient.post(API_ENDPOINTS.REVIEWS, data);
    return response.data;
  },

  // 리뷰 수정
  updateReview: async (reviewId: number, data: { newRating?: number; newComment?: string }): Promise<ReviewDto> => {
    const response = await apiClient.put(API_ENDPOINTS.REVIEW_BY_ID(reviewId), data);
    return response.data;
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REVIEW_BY_ID(reviewId));
  }
};