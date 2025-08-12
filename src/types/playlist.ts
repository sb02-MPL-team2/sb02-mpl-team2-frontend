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
  subscriberCount: number;
  // TODO: 백엔드에서 totalContentCount 필드 추가 필요
  // 현재는 items.length로 계산하고 있지만, 성능상 백엔드에서 카운트를 계산해서 내려주는 것이 좋음
  profile: UserSlimDto;
  items: PlaylistItemDto[];
  contentResponseDtoList: ContentResponseDto[];
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