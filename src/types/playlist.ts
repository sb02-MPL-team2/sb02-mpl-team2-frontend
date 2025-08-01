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
  userId: number;
  title: string;
  description: string;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
  items: PlaylistItem[];
}

export interface PlaylistCreateRequest {
  userId: number;
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