import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  ChatMessage, 
  Participant, 
  WebSocketConnectionState,
  RoomJoinResponse,
  DisconnectionInfo
} from '@/types/livewatch';
import { LiveWatchWebSocketClient } from '@/lib/websocket-client';
import { liveWatchService } from '@/services/liveWatchService';
import { tokenManager } from '@/lib/tokenManager';

interface UseLiveWatchProps {
  contentId: number;
  autoConnect?: boolean;
}

interface UseLiveWatchReturn {
  // 연결 상태
  connectionState: WebSocketConnectionState;
  isConnected: boolean;
  
  // 방 정보
  roomInfo: RoomJoinResponse | null;
  roomId: number | null;
  
  // 채팅
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  loadMoreMessages: () => void;
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;
  
  // 참여자
  participants: Participant[];
  participantCount: number;
  
  // 방 제어
  joinRoom: () => void;
  leaveRoom: () => void;
  isJoining: boolean;
  isLeaving: boolean;
  
  // 에러
  error: string | null;
  clearError: () => void;
}

export function useLiveWatch({ 
  contentId, 
  autoConnect = true 
}: UseLiveWatchProps): UseLiveWatchReturn {
  
  // State
  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null
  });
  const [roomInfo, setRoomInfo] = useState<RoomJoinResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  // Refs
  const webSocketClient = useRef<LiveWatchWebSocketClient | null>(null);
  const roomId = roomInfo?.roomId || null;
  
  
  // WebSocket 클라이언트 초기화
  useEffect(() => {
    webSocketClient.current = new LiveWatchWebSocketClient();
    
    webSocketClient.current.setCallbacks({
      onMessage: (message: ChatMessage) => {
        setMessages(prev => {
          // 중복 메시지 확인 - ID가 있는 경우와 없는 경우 모두 처리
          const isDuplicate = prev.some(m => {
            if (m.id && message.id) {
              // 둘 다 ID가 있으면 ID로 비교
              return m.id === message.id;
            } else {
              // ID가 없으면 시간, 사용자, 내용으로 비교 (JOIN/LEAVE 메시지)
              return m.sentAt === message.sentAt && 
                     m.userId === message.userId && 
                     m.content === message.content &&
                     m.messageType === message.messageType;
            }
          });
          
          return isDuplicate ? prev : [...prev, message];
        });
      },
      onParticipantUpdate: (newParticipants: Participant[]) => {
        setParticipants(newParticipants);
      },
      onUserJoin: (participant: Participant) => {
        setParticipants(prev => {
          // 중복 확인 후 추가
          const exists = prev.some(p => p.userId === participant.userId);
          return exists ? prev : [...prev, participant];
        });
      },
      onUserLeave: (userId: number) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId));
      },
      onError: (errorMessage: string) => {
        console.error('[LiveWatch] WebSocket error:', errorMessage);
        setError(errorMessage);
      },
      onConnectionChange: (state: WebSocketConnectionState) => {
        setConnectionState(state);
      },
      onDisconnection: (info: DisconnectionInfo) => {
        console.log('[LiveWatch] Disconnection detected:', info);
        
        // 예기치 않은 연결 해제인 경우에만 알림 표시 (백엔드 검증 목적)
        if (info.wasUnexpected) {
          alert(`실시간 연결이 끊어졌습니다\n${info.message} (${info.timestamp.toLocaleTimeString()})`);
        }
      }
    });
    
    // 브라우저 종료/새로고침 시 명시적 방 퇴장 처리 (백엔드 검증 목적)
    const handleBeforeUnload = () => {
      if (roomId && webSocketClient.current) {
        const token = tokenManager.getToken();
        if (token) {
          // fetch API with keepalive 옵션을 사용하여 인증된 요청 전송
          fetch(`http://localhost:8080/api/livewatch/rooms/${roomId}/leave`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
            keepalive: true, // 페이지 언로드 후에도 요청 유지
          }).catch(error => {
            console.error('[LiveWatch] Failed to leave room on beforeunload:', error);
          });
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // 컴포넌트 언마운트 시에만 정리 (roomId 변경 시가 아님)
      if (webSocketClient.current) {
        webSocketClient.current.disconnect();
      }
    };
  }, []); // roomId 의존성 제거 - 컴포넌트 생명주기에만 의존
  
  // 자동 연결
  useEffect(() => {
    if (autoConnect && webSocketClient.current && !connectionState.isConnected && !connectionState.isConnecting) {
      webSocketClient.current.connect();
    }
  }, [autoConnect, connectionState.isConnected, connectionState.isConnecting]);
  
  // 방 참여 mutation
  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      const response = await liveWatchService.joinRoom(roomId);
      return response;
    },
    onSuccess: (response: RoomJoinResponse) => {
      setRoomInfo(response);
      setParticipants(response.participants);
      
      // WebSocket으로 방 참여
      if (webSocketClient.current && connectionState.isConnected) {
        webSocketClient.current.joinRoom(response.roomId);
      }
      
      // 메시지 히스토리 로드
      loadMessages(response.roomId);
    },
    onError: (error: any) => {
      console.error('[LiveWatch] Failed to join room:', error);
      setError(error.response?.data?.message || 'Failed to join room');
    }
  });
  
  // 방 나가기 mutation
  const leaveRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      await liveWatchService.leaveRoom(roomId);
    },
    onSuccess: () => {
      if (webSocketClient.current) {
        webSocketClient.current.leaveRoom();
      }
      setRoomInfo(null);
      setMessages([]);
      setParticipants([]);
      setNextCursor(null);
      setHasMoreMessages(true);
    },
    onError: (error: any) => {
      console.error('[LiveWatch] Failed to leave room:', error);
      setError(error.response?.data?.message || 'Failed to leave room');
    }
  });
  
  // 메시지 히스토리 로드
  const { isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['livewatch-messages', roomId, nextCursor],
    queryFn: async () => {
      if (!roomId) return null;
      
      const response = await liveWatchService.getMessages(roomId, nextCursor || undefined);
      return response;
    },
    enabled: false, // 수동으로 호출
    staleTime: 0,
    gcTime: 0
  });
  
  const loadMessages = useCallback(async (targetRoomId: number, cursor?: string) => {
    try {
      const response = await liveWatchService.getMessages(targetRoomId, cursor);
      
      if (cursor) {
        // 더 많은 메시지 로드 (이전 메시지를 앞에 추가)
        setMessages(prev => [...response.messages.reverse(), ...prev]);
      } else {
        // 초기 메시지 로드 (시간순으로 정렬: 오래된 것부터)
        setMessages(response.messages.reverse());
      }
      
      setNextCursor(response.nextCursor);
      setHasMoreMessages(response.hasNext);
    } catch (error: any) {
      console.error('[LiveWatch] Failed to load messages:', error);
      setError(error.response?.data?.message || 'Failed to load messages');
    }
  }, []);
  
  // 더 많은 메시지 로드
  const loadMoreMessages = useCallback(() => {
    if (roomId && nextCursor && hasMoreMessages && !isLoadingMessages) {
      loadMessages(roomId, nextCursor);
    }
  }, [roomId, nextCursor, hasMoreMessages, isLoadingMessages, loadMessages]);
  
  // 메시지 전송
  const sendMessage = useCallback((content: string) => {
    if (!webSocketClient.current || !connectionState.isConnected) {
      setError('WebSocket is not connected');
      return;
    }
    
    webSocketClient.current.sendMessage(content);
  }, [connectionState.isConnected]);
  
  // 방 참여 (콘텐츠 ID를 통해)
  const joinRoom = useCallback(async () => {
    if (!connectionState.isConnected) {
      setError('WebSocket is not connected');
      return;
    }
    
    try {
      // 콘텐츠별 방 조회/생성 및 자동 참여
      const response = await liveWatchService.getOrCreateRoomByContent(contentId);
      setRoomInfo(response);
      setParticipants(response.participants);
      
      // WebSocket으로 방 참여
      if (webSocketClient.current && connectionState.isConnected) {
        webSocketClient.current.joinRoom(response.roomId);
      }
      
      // 메시지 히스토리 로드
      loadMessages(response.roomId);
    } catch (error: any) {
      console.error('[LiveWatch] Failed to join room via content:', error);
      setError(error.response?.data?.message || 'Failed to join room');
    }
  }, [contentId, connectionState.isConnected, loadMessages]);
  
  // 방 나가기
  const leaveRoom = useCallback(() => {
    if (roomId) {
      leaveRoomMutation.mutate(roomId);
    }
  }, [roomId, leaveRoomMutation]);
  
  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    // 연결 상태
    connectionState,
    isConnected: connectionState.isConnected,
    
    // 방 정보
    roomInfo,
    roomId,
    
    // 채팅
    messages,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMessages,
    
    // 참여자
    participants,
    participantCount: participants.length,
    
    // 방 제어
    joinRoom,
    leaveRoom,
    isJoining: false, // joinRoom이 이제 직접 구현되므로 별도 상태 관리 필요
    isLeaving: leaveRoomMutation.isPending,
    
    // 에러
    error: error || connectionState.error,
    clearError
  };
}