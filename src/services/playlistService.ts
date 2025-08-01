import apiClient from '@/lib/api';
import { PlaylistDto, PlaylistItem, PlaylistCreateRequest } from '@/types';

export const playlistService = {
  // 사용자의 플레이리스트 목록 조회
  getUserPlaylists: async (userId: number, page = 0, size = 20): Promise<{
    content: PlaylistDto[]
    size: number
    hasNext: boolean
    nextCursor: string | null
  }> => {
    const response = await apiClient.get(`/playlist/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // 플레이리스트 생성
  createPlaylist: async (data: PlaylistCreateRequest): Promise<PlaylistDto> => {
    const response = await apiClient.post('/playlist', data);
    return response.data;
  },

  // 플레이리스트 상세 조회
  getPlaylistById: async (playlistId: number): Promise<PlaylistDto> => {
    const response = await apiClient.get(`/playlist/${playlistId}`);
    return response.data;
  },

  // 플레이리스트에 콘텐츠 추가
  addContentToPlaylist: async (playlistId: number, contentId: number): Promise<{
    message: string
    item: PlaylistItem
  }> => {
    const response = await apiClient.post(`/playlist/${playlistId}/items`, {
      contentId
    });
    return response.data;
  },

  // 플레이리스트에서 콘텐츠 제거
  removeContentFromPlaylist: async (playlistId: number, itemId: number): Promise<void> => {
    await apiClient.delete(`/playlist/${playlistId}/items/${itemId}`);
  },

  // 플레이리스트 구독
  subscribePlaylist: async (playlistId: number): Promise<void> => {
    await apiClient.post(`/playlist/${playlistId}/subscribe`);
  },

  // 플레이리스트 구독 해제
  unsubscribePlaylist: async (playlistId: number): Promise<void> => {
    await apiClient.delete(`/playlist/${playlistId}/subscribe`);
  },

  // 내가 구독한 플레이리스트 목록
  getSubscribedPlaylists: async (): Promise<PlaylistDto[]> => {
    const response = await apiClient.get('/playlist/subscribed');
    return response.data;
  },
};