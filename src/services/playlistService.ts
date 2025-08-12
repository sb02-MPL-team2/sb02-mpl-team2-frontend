import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { PlaylistDto, PlaylistCreateRequest, CursorPageResponsePlayListDto } from '@/types';

export const playlistService = {
  // 모든 플레이리스트 조회 (공개)
  getAllPlaylists: async (cursor?: string, size = 20): Promise<CursorPageResponsePlayListDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLISTS, {
      params: {
        cursor,
        size
      }
    });
    return response.data;
  },

  // 사용자의 플레이리스트 목록 조회
  getUserPlaylists: async (userId: number, cursor?: string, size = 20): Promise<CursorPageResponsePlayListDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_BY_USER(userId), {
      params: { 
        cursor,
        size
      }
    });
    return response.data;
  },

  // 플레이리스트 생성
  createPlaylist: async (data: PlaylistCreateRequest): Promise<PlaylistDto> => {
    // 백엔드에서 JWT 토큰으로 사용자 ID를 자동 인식
    const response = await apiClient.post(API_ENDPOINTS.PLAYLISTS, data);
    return response.data;
  },

  // 플레이리스트 상세 조회
  getPlaylistById: async (playlistId: number): Promise<PlaylistDto> => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_BY_ID(playlistId));
    return response.data;
  },

  // 플레이리스트에 콘텐츠 추가
  addContentToPlaylist: async (playlistId: number, contentId: number): Promise<PlaylistDto> => {
    const response = await apiClient.post(API_ENDPOINTS.PLAYLIST_ADD_CONTENT, {
      playListId: playlistId,
      contentId
    });
    return response.data;
  },

  // 플레이리스트에 여러 콘텐츠 추가
  addContentListToPlaylist: async (playlistId: number, contentIds: number[]): Promise<PlaylistDto> => {
    const response = await apiClient.post(API_ENDPOINTS.PLAYLIST_ADD_CONTENT_LIST, {
      playListId: playlistId,
      contentIds
    });
    return response.data;
  },

  // 플레이리스트에서 콘텐츠 제거
  removeContentFromPlaylist: async (playlistId: number, contentId: number): Promise<void> => {
    await apiClient.delete('/playlists/items', {
      data: {
        playListId: playlistId,
        contentId
      }
    });
  },

  // 플레이리스트 삭제
  deletePlaylist: async (playlistId: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PLAYLIST_BY_ID(playlistId));
  },

  // 플레이리스트 수정
  updatePlaylist: async (playlistId: number, data: Partial<PlaylistCreateRequest>): Promise<PlaylistDto> => {
    const response = await apiClient.patch(API_ENDPOINTS.PLAYLIST_BY_ID(playlistId), data);
    return response.data;
  },

  // 플레이리스트 구독
  subscribePlaylist: async (playlistId: number): Promise<PlaylistDto> => {
    const response = await apiClient.post(API_ENDPOINTS.PLAYLIST_SUBSCRIBE, {
      playlistId
    });
    return response.data;
  },

  // 플레이리스트 구독 해제
  unsubscribePlaylist: async (playlistId: number): Promise<PlaylistDto> => {
    const response = await apiClient.delete(API_ENDPOINTS.PLAYLIST_UNSUBSCRIBE, {
      data: {
        playlistId
      }
    });
    return response.data;
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