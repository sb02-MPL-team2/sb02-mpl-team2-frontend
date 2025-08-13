import { NotificationDto } from '@/types';
import { tokenManager } from './tokenManager';

export class NotificationClient {
  private eventSource: EventSource | null = null;
  private onNotificationCallback: ((notification: NotificationDto) => void) | null = null;
  private onConnectionStatusCallback: ((connected: boolean) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
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

      // URL에 토큰을 파라미터로 추가 (EventSource는 커스텀 헤더 제한)
      const url = new URL('http://localhost:8080/sse');
      url.searchParams.set('token', accessToken);
      if (lastEventId) {
        url.searchParams.set('lastEventId', lastEventId);
      }
      
      this.eventSource = new EventSource(url.toString(), {
        withCredentials: true
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
          
          this.onNotificationCallback?.(notification);
        } catch (error) {
          console.error('알림 데이터 파싱 실패:', error);
        }
      };

      this.eventSource.addEventListener('heartbeat', (event) => {
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
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  reconnect() {
    this.reconnectAttempts = 0;
    this.connect();
  }
}

export const notificationClient = new NotificationClient();