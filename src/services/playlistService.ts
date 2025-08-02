import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { PlaylistDto, PlaylistItem, PlaylistCreateRequest } from '@/types';

export const playlistService = {
  // 모든 플레이리스트 조회 (공개)
  getAllPlaylists: async (): Promise<PlaylistDto[]> => {
    const response = await apiClient.get<PlaylistDto[]>(API_ENDPOINTS.PLAYLISTS);
    return response.data;
  },

  // 사용자의 플레이리스트 목록 조회
  getUserPlaylists: async (userId: number, page = 0, size = 20): Promise<{
    content: PlaylistDto[]
    size: number
    hasNext: boolean
    nextCursor: string | null
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_BY_USER(userId), {
      params: { page, size }
    });
    return response.data;
  },

  // 플레이리스트 생성
  createPlaylist: async (data: PlaylistCreateRequest): Promise<PlaylistDto> => {
    const response = await apiClient.post(API_ENDPOINTS.PLAYLISTS, data);
    return response.data;
  },

  // 플레이리스트 상세 조회
  getPlaylistById: async (playlistId: number): Promise<PlaylistDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_BY_ID(playlistId));
    return response.data;
  },

  // 플레이리스트에 콘텐츠 추가
  addContentToPlaylist: async (playlistId: number, contentId: number): Promise<{
    message: string
    item: PlaylistItem
  }> => {
    const response = await apiClient.post(`${API_ENDPOINTS.PLAYLIST_BY_ID(playlistId)}/items`, {
      contentId
    });
    return response.data;
  },

  // 플레이리스트에서 콘텐츠 제거
  removeContentFromPlaylist: async (playlistId: number, itemId: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PLAYLIST_BY_ID(playlistId)}/items/${itemId}`);
  },

  // 플레이리스트 구독
  subscribePlaylist: async (playlistId: number): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.PLAYLIST_SUBSCRIBE(playlistId));
  },

  // 플레이리스트 구독 해제
  unsubscribePlaylist: async (playlistId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PLAYLIST_SUBSCRIBE(playlistId));
  },

  // 내가 구독한 플레이리스트 목록
  getSubscribedPlaylists: async (): Promise<PlaylistDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_SUBSCRIBED);
    return response.data;
  },

  // 특정 사용자가 구독한 플레이리스트 목록 (공개)
  getSubscribedPlaylistsByUser: async (userId: number): Promise<PlaylistDto[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_SUBSCRIBED_BY_USER(userId));
    return response.data;
  },
};