import { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotificationStore } from '@/stores/notification-store';
import { NotificationItem } from './notification-item';

export const NotificationPopover = () => {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,
    reconnect
  } = useNotificationStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-purple-600 hover:bg-purple-700"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">알림 ({unreadCount})</h3>
            <div className="flex items-center gap-2">
              {!isConnected && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={reconnect}
                  className="text-red-500 hover:text-red-700"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  재연결
                </Button>
              )}
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount}개의 읽지 않은 알림
            </p>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">새로운 알림이 없습니다</p>
              <p className="text-xs text-gray-400 mt-1">
                실시간으로 알림을 받으려면 로그인을 유지해주세요
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="w-full text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              모든 알림 삭제
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};