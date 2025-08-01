import apiClient from '@/lib/api';
import { ContentResponseDto } from '@/types';

export const contentService = {
  // 전체 콘텐츠 조회
  getContents: async (): Promise<ContentResponseDto[]> => {
    const response = await apiClient.get<ContentResponseDto[]>('/contents');
    return response.data;
  },

  // 콘텐츠 상세 조회
  getContentById: async (contentId: number): Promise<ContentResponseDto> => {
    const response = await apiClient.get<ContentResponseDto>(`/contents/${contentId}`);
    return response.data;
  },

  // 카테고리별 콘텐츠 조회
  getContentsByCategory: async (category: string): Promise<ContentResponseDto[]> => {
    const response = await apiClient.get<ContentResponseDto[]>(`/contents/category/${category}`);
    return response.data;
  },
};