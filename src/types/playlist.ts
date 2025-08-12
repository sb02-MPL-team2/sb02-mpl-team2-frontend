import { ContentResponseDto } from './content';

// Playlist related types
export interface PlaylistItem {
  id: number;
  contentId: number;
  orderIndex: number;
  createdAt: string;
  content?: ContentResponseDto; // enriched when fetched
}

export interface PlaylistDto {
  id: number;
  userId?: number;
  title?: string;        // 상세 조회 시에만 있음
  summary: string;       // 목록 조회 시 플레이리스트 이름 (백엔드 응답)
  description?: string;  // 상세 조회 시에만 있음
  subscribeCount: number; // 백엔드 응답 필드명으로 통일
  totalContent: number;   // 백엔드 응답 필드명으로 통일
  createdAt?: string;
  updatedAt: string;
  items?: PlaylistItem[]; // 상세 조회 시에만 있음
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

export interface PlaylistState {
  playlists: PlaylistDto[];
  selectedPlaylist: PlaylistDto | null;
  subscribedPlaylists: PlaylistDto[];
  isLoading: boolean;
  error: string | null;
}

// Subscription related types
export interface PlaylistSubscription {
  id: number;
  userId: number;
  playlistId: number;
  createdAt: string;
}