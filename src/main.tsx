// 立即显示调试信息
console.log('=== main.tsx 开始执行 ===')

// 导入polyfills以修复CosmJS库的Node.js模块问题
import './polyfills'

console.log('polyfills 导入完成')

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './styles/globals.css'

console.log('所有模块导入完成')
console.log('React:', typeof React)
console.log('ReactDOM:', typeof ReactDOM)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

console.log('queryClient 创建完成')

// 延迟执行，确保DOM完全加载
setTimeout(() => {
  try {
    const rootElement = document.getElementById('root')
    console.log('rootElement:', rootElement)
    
    if (!rootElement) {
      throw new Error('Root element not found')
    }
    
    const root = ReactDOM.createRoot(rootElement)
    console.log('React root 创建完成')
    
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>,
    )
    
    console.log('React 应用渲染完成')
  } catch (error) {
    console.error('React 应用渲染失败:', error)
  }
}, 100)