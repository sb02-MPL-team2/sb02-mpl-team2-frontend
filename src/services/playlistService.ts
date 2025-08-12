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
    // TODO: 백엔드에서 cursor null 체크가 추가되면 이 기본값 설정 제거
    // 임시 해결책: 현재 시간 + 1일을 기본 cursor로 사용 (모든 플레이리스트 포함)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // LocalDateTime 형식에 맞게 변환 (Z와 밀리초 제거)
    const defaultCursor = tomorrow.toISOString().replace('Z', '');
    
    const response = await apiClient.get(API_ENDPOINTS.PLAYLIST_BY_USER(userId), {
      params: { 
        page, 
        size, 
        cursor: defaultCursor 
      }
    });
    return response.data;
  },

  // 플레이리스트 생성
  createPlaylist: async (data: PlaylistCreateRequest): Promise<PlaylistDto> => {
    // TODO: 백엔드에서 JWT 토큰으로 사용자 ID를 자동 인식하도록 변경 필요
    // 임시 해결책: API 호출로 현재 사용자 정보 가져오기
    const userResponse = await apiClient.get(API_ENDPOINTS.USERS_ME);
    const userId = userResponse.data.id;
    
    const requestData = {
      ...data,
      userId: userId
    };
    
    const response = await apiClient.post(API_ENDPOINTS.PLAYLISTS, requestData);
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
    const response = await apiClient.post(API_ENDPOINTS.PLAYLIST_ADD_CONTENT, {
      playListId: playlistId,
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
    // TODO: 백엔드에서 JWT 토큰으로 사용자 ID를 자동 인식하도록 변경 필요
    // 임시 해결책: API 호출로 현재 사용자 정보 가져오기
    const userResponse = await apiClient.get(API_ENDPOINTS.USERS_ME);
    const userId = userResponse.data.id;
    
    await apiClient.post(API_ENDPOINTS.PLAYLIST_SUBSCRIBE, {
      userId: userId,
      playlistId: playlistId
    });
  },

  // 플레이리스트 구독 해제
  unsubscribePlaylist: async (playlistId: number): Promise<void> => {
    // TODO: 백엔드에서 JWT 토큰으로 사용자 ID를 자동 인식하도록 변경 필요
    // 임시 해결책: API 호출로 현재 사용자 정보 가져오기
    const userResponse = await apiClient.get(API_ENDPOINTS.USERS_ME);
    const userId = userResponse.data.id;
    
    await apiClient.delete(API_ENDPOINTS.PLAYLIST_UNSUBSCRIBE, {
      data: {
        userId: userId,
        playlistId: playlistId
      }
    });
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