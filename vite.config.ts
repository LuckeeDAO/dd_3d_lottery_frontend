import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Vercel部署使用根路径，GitHub Pages使用子路径
  base: process.env.VITE_BUILD_FOR_GITHUB_PAGES === 'true' ? '/dd_3d_lottery_frontend/' : '/',
  plugins: [
    react({
      // 启用React Fast Refresh
      fastRefresh: true,
      // 启用JSX运行时
      jsxRuntime: 'automatic',
    }),
    // 修复CosmJS解构问题的插件
    {
      name: 'fix-cosmjs-destructuring',
      generateBundle(options, bundle) {
        // 在所有JavaScript文件中查找并替换CosmJS的解构问题
        Object.keys(bundle).forEach(fileName => {
          if (fileName.endsWith('.js')) {
            const file = bundle[fileName];
            if (file.type === 'chunk') {
              // 替换解构赋值模式
              file.code = file.code.replace(
                /const\s*{\s*Request\s*,\s*Response\s*,\s*Headers\s*,\s*fetch\s*}\s*=\s*globalThis\s*;/g,
                'const Request = globalThis.Request || function(){}; const Response = globalThis.Response || function(){}; const Headers = globalThis.Headers || function(){}; const fetch = globalThis.fetch || function(){};'
              );
            }
          }
        });
      }
    }
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
    // 修复CosmJS库的Node.js模块问题
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME || 'DD 3D Lottery'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
    // 启用HMR优化
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    // 启用源码映射（仅开发环境）
    sourcemap: process.env.NODE_ENV === 'development',
    // 启用压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除console.log
        drop_console: process.env.NODE_ENV === 'production',
        // 移除debugger
        drop_debugger: process.env.NODE_ENV === 'production',
        // 启用死代码消除
        dead_code: true,
        // 启用无用代码消除
        unused: true,
      },
      mangle: {
        // 启用变量名混淆
        toplevel: true,
      },
    },
    rollupOptions: {
      plugins: [
        {
          name: 'fix-cosmjs-request',
          generateBundle(options, bundle) {
            for (const fileName in bundle) {
              const chunk = bundle[fileName];
              if (chunk.type === 'chunk' && chunk.code) {
                // 替换CosmJS中的问题代码
                chunk.code = chunk.code.replace(
                  /const\s*{\s*Request\s*}\s*=\s*globalThis/g,
                  'const { Request = globalThis.Request || function(){} } = globalThis'
                );
                chunk.code = chunk.code.replace(
                  /const\s*{\s*Response\s*}\s*=\s*globalThis/g,
                  'const { Response = globalThis.Response || function(){} } = globalThis'
                );
                chunk.code = chunk.code.replace(
                  /const\s*{\s*Headers\s*}\s*=\s*globalThis/g,
                  'const { Headers = globalThis.Headers || function(){} } = globalThis'
                );
              }
            }
          }
        }
      ],
      external: (id) => {
        // 排除Node.js内置模块，让Vite处理polyfill
        if (id.startsWith('node:')) return false;
        return false;
      },
      output: {
             manualChunks: {
               vendor: ['react', 'react-dom'],
               mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
               router: ['react-router-dom'],
               query: ['@tanstack/react-query'],
               store: ['zustand'],
               // cosmjs: ['@cosmjs/cosmwasm-stargate', '@cosmjs/stargate', '@cosmjs/crypto', '@cosmjs/encoding'], // 暂时注释掉
               utils: ['lodash', 'date-fns'],
             },
        // 启用chunk文件名优化
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 启用chunk大小警告
    chunkSizeWarningLimit: 1000,
    // 启用资源内联阈值
    assetsInlineLimit: 4096,
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用资源压缩
    reportCompressedSize: true,
  },
  // 启用预构建优化 - 参考decentralized_decision_frontend配置
  optimizeDeps: {
    // 预构建依赖
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'lodash',
      'date-fns',
      // CosmJS相关依赖
      '@cosmjs/cosmwasm-stargate',
      '@cosmjs/stargate',
      '@cosmjs/crypto',
      '@cosmjs/encoding',
      '@cosmjs/math',
      '@cosmjs/proto-signing',
    ],
    // 排除预构建
    exclude: ['@vite/client', '@vite/env'],
    // 启用强制预构建
    force: true,
  },
  // 启用ESBuild优化
  esbuild: {
    // 启用JSX优化
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    // 启用代码压缩
    minifyIdentifiers: process.env.NODE_ENV === 'production',
    minifySyntax: process.env.NODE_ENV === 'production',
    minifyWhitespace: process.env.NODE_ENV === 'production',
    // 启用Tree Shaking
    treeShaking: true,
  },
})
