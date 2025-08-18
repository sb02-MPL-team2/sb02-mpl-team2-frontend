export interface LiveWatchRoom {
  id: number;
  title: string;
  createdAt: string;
  participantCount: number;
  participants: Participant[];
}

export interface Participant {
  userId: number;
  userName: string;
  profileUrl: string | null;
  participatedAt: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sentAt: string;
  userId: number;
  userName: string;
  messageType: MessageType;
}

export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE'
}

export interface SendMessageRequest {
  liveWatchRoomId: number;
  content: string;
}

export interface ChatMessagePageResponse {
  messages: ChatMessage[];
  messageCount: number;
  nextCursor: string | null;
  hasNext: boolean;
}

export interface RoomJoinResponse {
  roomId: number;
  title: string;
  createdAt: string;
  participantCount: number;
  participants: Participant[];
}

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface DisconnectionInfo {
  reason: 'normal' | 'error' | 'network';
  message: string;
  timestamp: Date;
  wasUnexpected: boolean;
}

export interface LiveWatchWebSocketCallbacks {
  onMessage: (message: ChatMessage) => void;
  onParticipantUpdate: (participants: Participant[]) => void;
  onUserJoin: (participant: Participant) => void;
  onUserLeave: (userId: number) => void;
  onError: (error: string) => void;
  onConnectionChange: (state: WebSocketConnectionState) => void;
  onDisconnection?: (info: DisconnectionInfo) => void;
}