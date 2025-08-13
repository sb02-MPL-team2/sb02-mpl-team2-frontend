import { create } from 'zustand';
import { NotificationDto } from '@/types';
import { notificationClient } from '@/lib/notification-client';

interface NotificationState {
  notifications: NotificationDto[];
  unreadCount: number;
  isConnected: boolean;
  
  // Actions
  addNotification: (notification: NotificationDto) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: number) => void;
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
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        return {
          unreadCount: Math.max(0, state.unreadCount - 1)
        };
      }
      return state;
    });
  },

  markAllAsRead: () => {
    set({
      unreadCount: 0
    });
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== notificationId),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  clearAllNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0
    });
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