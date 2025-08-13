import { create } from 'zustand';
import { NotificationDto } from '@/types';
import { notificationClient } from '@/lib/notification-client';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/stores/authStore';

/**
 * 알림 상태 관리 스토어
 * 
 * TODO: 백엔드 개선 사항
 * 1. GET /api/notifications - 초기 알림 목록 조회 API 추가
 * 2. DELETE /api/notifications/me - JWT 토큰 기반 전체 삭제 API
 * 3. 정렬 순서: createdAt DESC (서버에서 정렬된 데이터 제공)
 * 
 * 현재 제약사항:
 * - SSE로만 실시간 알림 수신 가능
 * - 읽음 처리 = 삭제 처리로 통일
 * - 앱 시작 시 기존 알림 목록 로드 불가
 */

interface NotificationState {
  notifications: NotificationDto[];
  unreadCount: number;
  isConnected: boolean;
  
  // Actions
  addNotification: (notification: NotificationDto) => void;
  markAsRead: (notificationId: number) => void; // 읽음 처리 (삭제와 동일)
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  setConnectionStatus: (connected: boolean) => void;
  
  // SSE 관련
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  addNotification: (notification) => {
    set((state) => ({
      // 새 알림을 맨 앞에 추가 (최신순 정렬: 발행 시간순)
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
    // TODO: 백엔드에 초기 알림 조회 API 추가되면 createdAt 기준으로 정렬하는 로직 추가
    // 현재는 SSE로 받은 순서대로 최신이 위에 오도록 처리
  },

  markAsRead: async (notificationId) => {
    try {
      // 읽음 처리 = 삭제와 동일
      await notificationService.deleteNotification(notificationId);
      
      // 상태에서 제거하고 화면 재렌더링
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      
      console.log(`알림 ${notificationId} 읽음 처리 완료`);
      // TODO: 백엔드에 초기 알림 조회 API 추가되면 삭제 후 전체 목록 다시 조회하는 방식으로 변경
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다');
        return;
      }

      // 모든 알림 삭제
      await notificationService.deleteAllNotifications(userId);
      
      // 상태 초기화하고 화면 재렌더링
      set({
        notifications: [],
        unreadCount: 0
      });
      
      console.log('모든 알림 읽음 처리 완료');
      // TODO: 백엔드에 초기 알림 조회 API 추가되면 삭제 후 전체 목록 다시 조회하는 방식으로 변경
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  },

  clearAllNotifications: async () => {
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다');
        return;
      }

      await notificationService.deleteAllNotifications(userId);
      
      set({
        notifications: [],
        unreadCount: 0
      });
      
      console.log('모든 알림 삭제 완료');
      // TODO: 백엔드에 초기 알림 조회 API 추가되면 삭제 후 전체 목록 다시 조회하는 방식으로 변경
    } catch (error) {
      console.error('모든 알림 삭제 실패:', error);
    }
  },

  setConnectionStatus: (connected) => {
    set({ isConnected: connected });
  },

  connect: () => {
    // SSE 클라이언트에 콜백 등록
    notificationClient.onNotification((notification) => {
      get().addNotification(notification);
    });

    notificationClient.onConnectionStatus((connected) => {
      get().setConnectionStatus(connected);
    });

    // SSE 연결 시작
    notificationClient.connect();
  },

  disconnect: () => {
    notificationClient.disconnect();
  },

  reconnect: () => {
    notificationClient.reconnect();
  }
}));