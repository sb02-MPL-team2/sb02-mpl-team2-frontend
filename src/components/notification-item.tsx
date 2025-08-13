import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationDto, NotificationType } from '@/types';

const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return created.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  }
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.NEW_MESSAGE:
      return '💬';
    case NotificationType.NEW_PLAYLIST_BY_FOLLOWING:
      return '🎵';
    case NotificationType.PLAYLIST_SUBSCRIBED:
      return '⭐';
    case NotificationType.NEW_FOLLOWER:
      return '👥';
    case NotificationType.ROLE_CHANGED:
      return '🔒';
    case NotificationType.ASYNC_FAILED:
      return '⚠️';
    case NotificationType.BROADCAST_TODAY_PLAYLIST:
      return '📢';
    default:
      return '🔔';
  }
};

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkAsRead?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onRemove 
}: NotificationItemProps) {
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg group">
      <div className="text-lg flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm text-gray-900 leading-tight">
              {notification.title}
            </p>
            {notification.content && (
              <p className="text-sm text-gray-600 mt-1 leading-tight">
                {notification.content}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {timeAgo}
            </p>
          </div>
          
          {(onMarkAsRead || onRemove) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onMarkAsRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 w-6 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(notification.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
