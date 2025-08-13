import apiClient from '@/lib/api';

export const notificationService = {
  /**
   * 개별 알림 삭제 (읽음 처리와 동일)
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * 사용자의 모든 알림 삭제 (모두 읽음 처리와 동일)
   * TODO: 백엔드에서 JWT 토큰으로 userId 추출하도록 수정하면 
   * DELETE /notifications/me 같은 엔드포인트로 단순화 가능
   */
  async deleteAllNotifications(userId: number): Promise<void> {
    await apiClient.delete(`/notifications/users/${userId}`);
  },
};