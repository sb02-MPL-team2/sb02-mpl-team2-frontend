import { QueryClient } from '@tanstack/react-query';

// React Query Client 설정 (백엔드 테스트용 - 캐싱 최소화)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,              // 데이터를 즉시 stale로 처리
      gcTime: 1000 * 60 * 5,     // 5분 후 캐시 삭제 (cacheTime → gcTime in v5)
      refetchOnMount: true,      // 컴포넌트 마운트 시마다 새로 요청
      refetchOnWindowFocus: true, // 윈도우 포커스 시마다 새로 요청
      refetchOnReconnect: true,  // 네트워크 재연결 시 새로 요청
      retry: 1,                  // 실패 시 1번만 재시도 (빠른 에러 확인)
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
