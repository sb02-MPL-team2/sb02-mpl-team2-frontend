import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode 비활성화 - 개발 중 useEffect 중복 실행 방지
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 개발 환경에서만 React Query DevTools 표시 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  // </React.StrictMode>,
)