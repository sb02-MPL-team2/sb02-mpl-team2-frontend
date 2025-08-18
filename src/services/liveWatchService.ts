import apiClient from '@/lib/api';
import { 
  RoomJoinResponse, 
  ChatMessagePageResponse, 
  LiveWatchRoom 
} from '@/types/livewatch';

export const liveWatchService = {
  /**
   * 콘텐츠별 LiveWatch 방 정보 조회 또는 생성 (자동 참여)
   * @param contentId 콘텐츠 ID
   * @returns 방 참여 응답 (방 정보 + 참여자 목록)
   */
  async getOrCreateRoomByContent(contentId: number): Promise<RoomJoinResponse> {
    const response = await apiClient.get<RoomJoinResponse>(`/livewatch/rooms/content/${contentId}`);
    return response.data;
  },

  /**
   * LiveWatch 방에 참여
   * @param roomId 방 ID
   * @returns 방 참여 응답 (방 정보 + 참여자 목록)
   */
  async joinRoom(roomId: number): Promise<RoomJoinResponse> {
    const response = await apiClient.post<RoomJoinResponse>(`/livewatch/rooms/${roomId}/join`);
    return response.data;
  },

  /**
   * LiveWatch 방에서 나가기
   * @param roomId 방 ID
   */
  async leaveRoom(roomId: number): Promise<void> {
    await apiClient.post(`/livewatch/rooms/${roomId}/leave`);
  },

  /**
   * 채팅 메시지 히스토리 조회 (페이지네이션)
   * @param roomId 방 ID
   * @param cursor 커서 (이전 페이지 마지막 메시지 식별자)
   * @param size 페이지 크기 (기본값: 30)
   * @returns 채팅 메시지 페이지 응답
   */
  async getMessages(
    roomId: number, 
    cursor?: string, 
    size: number = 30
  ): Promise<ChatMessagePageResponse> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('size', size.toString());
    
    const response = await apiClient.get<ChatMessagePageResponse>(
      `/livewatch/rooms/${roomId}/messages?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 방 참여자 수 조회
   * @param roomId 방 ID
   * @returns 참여자 수
   */
  async getParticipantCount(roomId: number): Promise<number> {
    const response = await apiClient.get<number>(`/livewatch/rooms/${roomId}/participant-count`);
    return response.data;
  }
};