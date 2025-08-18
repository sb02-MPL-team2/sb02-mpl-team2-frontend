import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { 
  ChatMessage, 
  Participant, 
  LiveWatchWebSocketCallbacks,
  WebSocketConnectionState,
  MessageType,
  DisconnectionInfo
} from '@/types/livewatch';
import { tokenManager } from './tokenManager';

export class LiveWatchWebSocketClient {
  private client: Client;
  private roomId: number | null = null;
  private callbacks: Partial<LiveWatchWebSocketCallbacks> = {};
  private connectionState: WebSocketConnectionState = {
    isConnected: false,
    isConnecting: false,
    error: null
  };

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,  // STOMP 하트비트 (연결 유지)
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // 백엔드 검증을 위한 상세 로깅
        if (str.includes('SEND') || str.includes('RECEIVE') || str.includes('ERROR')) {
          console.log(`[STOMP Debug] ${new Date().toISOString()}:`, str);
        }
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.onConnect = (frame) => {
      console.log(`[WebSocket] ✅ Connected at ${new Date().toISOString()}:`, {
        server: frame.headers['server'],
        version: frame.headers['version'],
        heartBeat: frame.headers['heart-beat']
      });
      this.updateConnectionState({
        isConnected: true,
        isConnecting: false,
        error: null
      });
    };

    this.client.onDisconnect = (frame) => {
      console.log(`[WebSocket] 🔌 Disconnected at ${new Date().toISOString()}:`, {
        receipt: frame.headers['receipt'],
        message: frame.headers['message'] || 'Normal disconnect'
      });
      
      const disconnectionInfo: DisconnectionInfo = {
        reason: 'normal',
        message: '연결이 정상적으로 종료되었습니다.',
        timestamp: new Date(),
        wasUnexpected: false
      };
      
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: null
      });
      
      this.callbacks.onDisconnection?.(disconnectionInfo);
    };

    this.client.onStompError = (frame) => {
      console.error(`[WebSocket] ❌ STOMP Error at ${new Date().toISOString()}:`, {
        command: frame.command,
        headers: frame.headers,
        body: frame.body,
        isSecurityRelated: frame.headers['message']?.includes('401') || frame.headers['message']?.includes('403')
      });
      
      const disconnectionInfo: DisconnectionInfo = {
        reason: 'error',
        message: `STOMP 오류: ${frame.headers['message'] || '알 수 없는 서버 오류'}`,
        timestamp: new Date(),
        wasUnexpected: true
      };
      
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: frame.headers['message'] || 'WebSocket connection error'
      });
      
      this.callbacks.onDisconnection?.(disconnectionInfo);
    };

    this.client.onWebSocketError = (error) => {
      console.error(`[WebSocket] 🌐 Network Error at ${new Date().toISOString()}:`, {
        type: error.type,
        target: error.target?.url,
        readyState: error.target?.readyState,
        error: error
      });
      
      const disconnectionInfo: DisconnectionInfo = {
        reason: 'network',
        message: '네트워크 오류로 인해 연결이 끊어졌습니다.',
        timestamp: new Date(),
        wasUnexpected: true
      };
      
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: 'WebSocket connection failed'
      });
      
      this.callbacks.onDisconnection?.(disconnectionInfo);
    };
  }

  private updateConnectionState(newState: Partial<WebSocketConnectionState>) {
    this.connectionState = { ...this.connectionState, ...newState };
    this.callbacks.onConnectionChange?.(this.connectionState);
  }

  public connect(): void {
    if (this.client.connected || this.connectionState.isConnecting) {
      return;
    }

    const accessToken = tokenManager.getToken();
    if (!accessToken) {
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: 'No access token available'
      });
      return;
    }

    this.updateConnectionState({
      isConnecting: true,
      error: null
    });

    // STOMP CONNECT에서 JWT 토큰 전달
    this.client.connectHeaders = {
      Authorization: `Bearer ${accessToken}`
    };

    this.client.activate();
  }

  public disconnect(): void {
    if (this.roomId !== null) {
      this.leaveRoom();
    }
    this.client.deactivate();
    this.updateConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null
    });
  }

  public joinRoom(roomId: number): void {
    if (!this.client.connected) {
      this.callbacks.onError?.('WebSocket is not connected');
      return;
    }

    if (this.roomId !== null && this.roomId !== roomId) {
      console.log(`[WebSocket] 🔄 Switching from room ${this.roomId} to room ${roomId}`);
      this.leaveRoom();
    }

    this.roomId = roomId;
    console.log(`[WebSocket] 🚪 Joining room ${roomId} at ${new Date().toISOString()}`);

    // 채팅 메시지 구독
    this.client.subscribe(`/topic/livewatch/rooms/${roomId}/messages`, (message: IMessage) => {
      console.log(`[WebSocket] 💬 Message received:`, JSON.parse(message.body));
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.callbacks.onMessage?.(chatMessage);
      } catch (error) {
        console.error('[WebSocket] Failed to parse chat message:', error);
        this.callbacks.onError?.('Failed to parse chat message');
      }
    });

    // 참여자 이벤트 구독
    this.client.subscribe(`/topic/livewatch/rooms/${roomId}/events`, (message: IMessage) => {
      console.log(`[WebSocket] 👥 Event received:`, JSON.parse(message.body));
      try {
        const eventMessage: ChatMessage = JSON.parse(message.body);
        
        // 1. 먼저 메시지를 채팅창에 추가
        this.callbacks.onMessage?.(eventMessage);
        
        // 2. 그 다음 참여자 목록 업데이트
        if (eventMessage.messageType === MessageType.JOIN) {
          const participant: Participant = {
            userId: eventMessage.userId,
            userName: eventMessage.userName,
            profileUrl: null, // 백엔드에서 제공하지 않는 경우
            participatedAt: eventMessage.sentAt
          };
          this.callbacks.onUserJoin?.(participant);
        } else if (eventMessage.messageType === MessageType.LEAVE) {
          this.callbacks.onUserLeave?.(eventMessage.userId);
        }
      } catch (error) {
        console.error('[WebSocket] Failed to parse event message:', error);
        this.callbacks.onError?.('Failed to parse event message');
      }
    });

    // 에러 메시지 구독
    this.client.subscribe('/user/queue/errors', (message: IMessage) => {
      console.error(`[WebSocket] 🚨 Backend error received:`, JSON.parse(message.body));
      try {
        const errorData = JSON.parse(message.body);
        this.callbacks.onError?.(errorData.message || 'Unknown error');
      } catch (error) {
        console.error('[WebSocket] Failed to parse error message:', error);
      }
    });

    console.log(`[WebSocket] ✅ Successfully joined room ${roomId}`);
  }

  public leaveRoom(): void {
    if (this.roomId !== null) {
      console.log(`[WebSocket] 🚪 Leaving room ${this.roomId} at ${new Date().toISOString()}`);
      // 구독 해제는 disconnect 시 자동으로 처리됨
      this.roomId = null;
    }
  }

  public sendMessage(content: string): void {
    if (!this.client.connected) {
      this.callbacks.onError?.('WebSocket is not connected');
      return;
    }

    if (this.roomId === null) {
      this.callbacks.onError?.('Not joined to any room');
      return;
    }

    const messagePayload = {
      liveWatchRoomId: this.roomId,
      content: content.trim()
    };

    if (!messagePayload.content) {
      this.callbacks.onError?.('Message content cannot be empty');
      return;
    }

    console.log(`[WebSocket] 📤 Sending message to room ${this.roomId}:`, messagePayload);
    
    // STOMP 메시지 전송 (토큰 불필요 - HTTP 핸드셰이크에서 이미 인증됨)
    this.client.publish({
      destination: '/app/livewatch/send',
      body: JSON.stringify(messagePayload)
    });
  }

  public setCallbacks(callbacks: Partial<LiveWatchWebSocketCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public getConnectionState(): WebSocketConnectionState {
    return { ...this.connectionState };
  }

  public isConnected(): boolean {
    return this.client.connected;
  }
}