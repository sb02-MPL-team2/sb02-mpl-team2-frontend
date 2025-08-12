// API Constants
export const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh', 
  AUTH_LOGOUT: '/auth/logout',
  
  // Auth
  AUTH_SIGNUP: '/auth/signup',
  
  // Users
  USERS: '/users',
  USERS_ME: '/users/me',
  USER_BY_ID: (userId: number) => `/users/${userId}`,
  
  // Contents
  CONTENTS: '/contents',
  CONTENT_BY_ID: (contentId: number) => `/contents/${contentId}`,
  CONTENTS_BY_CATEGORY: (category: string) => `/contents/category/${category}`,
  
  // Playlists
  PLAYLISTS: '/playlists',
  PLAYLIST_BY_ID: (playlistId: number) => `/playlists/${playlistId}`,
  PLAYLIST_BY_USER: (userId: number) => `/playlists/user/${userId}`,
  PLAYLIST_ADD_CONTENT: '/playlists/items',
  PLAYLIST_ADD_CONTENT_LIST: '/playlists/items/bulk',
  PLAYLIST_SUBSCRIBE: '/playlists/subscribe',
  PLAYLIST_UNSUBSCRIBE: '/playlists/unsubscribe',
  PLAYLIST_SUBSCRIBED: '/playlists/subscribed',
  PLAYLIST_SUBSCRIBED_BY_USER: (userId: number) => `/playlists/subscribed/user/${userId}`,
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEW_BY_ID: (reviewId: number) => `/reviews/${reviewId}`,
  REVIEWS_BY_CONTENT: (contentId: number) => `/reviews/content/${contentId}`,
  REVIEWS_BY_USER: (userId: number) => `/reviews/users/${userId}`,
  
  // Follows
  FOLLOW_USER: (followeeId: number) => `/follows/${followeeId}`,
  FOLLOW_STATUS: (followeeId: number) => `/follows/${followeeId}`,
  FOLLOWERS: (userId: number) => `/follows/${userId}/followers`,
  FOLLOWING: (userId: number) => `/follows/${userId}/followings`,
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_LOCK_USER: (userId: number) => `/admin/users/${userId}/lock`,
  ADMIN_UNLOCK_USER: (userId: number) => `/admin/users/${userId}/unlock`,
  ADMIN_UPDATE_ROLE: (userId: number) => `/admin/users/${userId}/role`,
} as const;

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  // Auth
  AUTH_ME: ['auth', 'me'],
  
  // Users
  USERS: ['users'],
  USER_ME: ['users', 'me'],
  USER: (userId: number) => ['users', userId],
  USER_BY_ID: (userId: number) => ['users', userId],
  
  // Contents
  CONTENTS: ['contents'],
  CONTENT: (contentId: number) => ['contents', contentId],
  CONTENTS_BY_CATEGORY: (category: string) => ['contents', 'category', category],
  
  // Playlists
  PLAYLISTS: ['playlists'],
  ALL_PLAYLISTS: ['playlists', 'all'],
  PLAYLIST: (playlistId: number) => ['playlists', playlistId],
  USER_PLAYLISTS: (userId: number) => ['playlists', 'user', userId],
  SUBSCRIBED_PLAYLISTS: ['playlists', 'subscribed'],
  USER_SUBSCRIBED_PLAYLISTS: (userId: number) => ['playlists', 'subscribed', 'user', userId],
  
  // Reviews
  REVIEWS: ['reviews'],
  CONTENT_REVIEWS: (contentId: number) => ['reviews', 'content', contentId],
  USER_REVIEWS: (userId: number) => ['reviews', 'user', userId],
  
  // Follows
  FOLLOWERS: (userId: number) => ['follows', 'followers', userId],
  FOLLOWING: (userId: number) => ['follows', 'following', userId],
  FOLLOW_STATUS: (userId: number) => ['follows', 'status', userId],
  
  // Admin
  ADMIN_USERS: ['admin', 'users'],
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const;

// Content Categories (실제 데이터에서 사용되는 카테고리들)
export const CONTENT_CATEGORIES = [
  '영화',
  '드라마', 
  '애니메이션',
  '코미디',
  '다큐멘터리',
] as const;

// Frontend Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONTENTS: '/contents',
  WATCH: (contentId: number) => `/watch/${contentId}`,
  REVIEW: (contentId: number) => `/review/${contentId}`,
  PLAYLISTS: '/playlists',
  PLAYLIST: (playlistId: number) => `/playlist/${playlistId}`,
  PROFILES: '/profiles',
  PROFILE: (userId: number) => `/profile/${userId}`,
  PROFILE_EDIT: '/profile/edit',
  CHAT: (userId: number) => `/chat/${userId}`,
  ADMIN_USERS: '/admin/users',
  NOT_FOUND: '/404',
} as const;
