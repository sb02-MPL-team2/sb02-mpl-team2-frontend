import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { ContentResponseDto } from '@/types';

export const contentService = {
  // 전체 콘텐츠 조회
  getContents: async (): Promise<ContentResponseDto[]> => {
    const response = await apiClient.get<ContentResponseDto[]>(API_ENDPOINTS.CONTENTS);
    return response.data;
  },

  // 콘텐츠 상세 조회
  getContentById: async (contentId: number): Promise<ContentResponseDto> => {
    const response = await apiClient.get<ContentResponseDto>(API_ENDPOINTS.CONTENT_BY_ID(contentId));
    return response.data;
  },

  // 카테고리별 콘텐츠 조회
  getContentsByCategory: async (category: string): Promise<ContentResponseDto[]> => {
    const response = await apiClient.get<ContentResponseDto[]>(API_ENDPOINTS.CONTENTS_BY_CATEGORY(category));
    return response.data;
  },
};