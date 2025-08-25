import { EventSourcePolyfill } from 'event-source-polyfill';
import { NotificationDto } from '@/types';
import { tokenManager } from './tokenManager';

export class NotificationClient {
  private eventSource: EventSourcePolyfill | null = null;
  private onNotificationCallback: ((notification: NotificationDto) => void) | null = null;
  private onConnectionStatusCallback: ((connected: boolean) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    // 이미 연결 중이면 무시
    if (this.eventSource?.readyState === EventSourcePolyfill.CONNECTING) {
      console.log('SSE 이미 연결 중 - 중복 연결 방지');
      return;
    }
    
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      const lastEventId = localStorage.getItem('lastEventId');
      const accessToken = tokenManager.getToken();
      
      if (!accessToken) {
        console.error('SSE 연결 실패: 액세스 토큰이 없습니다');
        this.onConnectionStatusCallback?.(false);
        return;
      }

      // event-source-polyfill로 헤더 지원
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
      };
      
      if (lastEventId) {
        headers['Last-Event-ID'] = lastEventId;
      }
      
      const sseUrl = typeof window !== 'undefined' 
        ? `${window.location.protocol}//${window.location.host}/sse`
        : 'http://localhost:8080/sse';
      
      this.eventSource = new EventSourcePolyfill(sseUrl, {
        headers,
        withCredentials: true,
        heartbeatTimeout: 60000, // 60초 하트비트
      });

      this.eventSource.onopen = () => {
        console.log('SSE 연결 성공');
        this.reconnectAttempts = 0;
        this.onConnectionStatusCallback?.(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const notification: NotificationDto = JSON.parse(event.data);
          
          if (event.lastEventId) {
            localStorage.setItem('lastEventId', event.lastEventId);
          }
          
          console.log('기본 메시지 수신:', notification);
          this.onNotificationCallback?.(notification);
        } catch (error) {
          console.error('알림 데이터 파싱 실패:', error);
        }
      };

      // 모든 알림 타입별 이벤트 리스너 등록
      const notificationTypes = [
        'NEW_MESSAGE',
        'NEW_PLAYLIST_BY_FOLLOWING', 
        'PLAYLIST_SUBSCRIBED',
        'NEW_FOLLOWER',
        'ROLE_CHANGED',
        'ASYNC_FAILED',
        'BROADCAST_TODAY_PLAYLIST'
      ];

      notificationTypes.forEach(type => {
        this.eventSource.addEventListener(type, (event: MessageEvent) => {
          try {
            const notification: NotificationDto = JSON.parse(event.data);
            
            if (event.lastEventId) {
              localStorage.setItem('lastEventId', event.lastEventId);
            }
            
            console.log(`${type} 알림 수신:`, notification);
            this.onNotificationCallback?.(notification);
          } catch (error) {
            console.error(`${type} 알림 데이터 파싱 실패:`, error);
          }
        });
      });

      this.eventSource.addEventListener('heartbeat', (event: MessageEvent) => {
        console.log('하트비트 수신:', event.data);
      });

      this.eventSource.onerror = (error) => {
        console.error('SSE 연결 에러:', error);
        this.onConnectionStatusCallback?.(false);
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          
          setTimeout(() => {
            this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };

    } catch (error) {
      console.error('SSE 연결 설정 실패:', error);
      this.onConnectionStatusCallback?.(false);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.onConnectionStatusCallback?.(false);
      console.log('SSE 연결 해제');
    }
  }

  onNotification(callback: (notification: NotificationDto) => void) {
    this.onNotificationCallback = callback;
  }

  onConnectionStatus(callback: (connected: boolean) => void) {
    this.onConnectionStatusCallback = callback;
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSourcePolyfill.OPEN;
  }

  reconnect() {
    this.reconnectAttempts = 0;
    this.connect();
  }
}

export const notificationClient = new NotificationClient();