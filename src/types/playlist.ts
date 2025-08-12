import { ContentResponseDto } from './content';
import { UserSlimDto } from './user';

// Playlist related types
export interface PlaylistItemDto {
  id: number;
  contentId: number;
}

export interface PlaylistDto {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  summary?: string;
  subscriberCount?: number; // 구버전 호환성
  subscribeCount?: number;  // 신버전 필드명
  totalContent: number;     // 백엔드에서 계산된 콘텐츠 개수
  profile?: UserSlimDto;    // 선택적 필드로 변경
  items?: PlaylistItemDto[]; // 선택적 필드로 변경
  contentResponseDtoList?: ContentResponseDto[]; // 선택적 필드로 변경
}

export interface PlaylistCreateRequest {
  title: string;
  description: string;
}

export interface PlaylistUpdateRequest {
  newTitle?: string;
  newDescription?: string;
}

export interface PlaylistItemRequest {
  playListId: number;
  contentId: number;
}

export interface PlaylistItemListRequest {
  playListId: number;
  contentIds: number[];
}

// Cursor-based pagination response
export interface CursorPageResponsePlayListDto {
  content: PlaylistDto[];
  size: number;
  hasNext: boolean;
  nextCursor: string | null;
}

export interface PlaylistState {
  playlists: PlaylistDto[];
  selectedPlaylist: PlaylistDto | null;
  subscribedPlaylists: PlaylistDto[];
  isLoading: boolean;
  error: string | null;
}

// Subscription related types
export interface SubscribeRequest {
  playlistId: number;
}