// 알림 관련 타입 정의
export enum NotificationType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_PLAYLIST_BY_FOLLOWING = 'NEW_PLAYLIST_BY_FOLLOWING', 
  PLAYLIST_SUBSCRIBED = 'PLAYLIST_SUBSCRIBED',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  ROLE_CHANGED = 'ROLE_CHANGED',
  ASYNC_FAILED = 'ASYNC_FAILED',
  BROADCAST_TODAY_PLAYLIST = 'BROADCAST_TODAY_PLAYLIST'
}

export interface NotificationDto {
  id: number;
  receiverId: number;
  publisherId: number;
  targetId: number;
  createdAt: string;
  type: NotificationType;
  title: string;
  content: string;
}

// TODO: 백엔드에 초기 알림 목록 조회 API 필요
// GET /api/notifications/users/{userId} - 사용자의 최근 알림들 조회
// 현재는 SSE로 실시간 알림만 수신 가능