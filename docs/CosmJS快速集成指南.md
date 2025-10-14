# CosmJS 快速集成指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install @cosmjs/cosmwasm-stargate @cosmjs/stargate
```

### 2. 创建 Polyfill 文件

#### `src/axios-polyfill.ts`
```typescript
console.log('=== axios-polyfill.ts 开始执行 ===');

// 确保全局对象存在
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// 修复 Web API 绑定
const originalFetch = window.fetch;
if (originalFetch) {
  const boundFetch = originalFetch.bind(window);
  (globalThis as any).fetch = boundFetch;
  (window as any).fetch = boundFetch;
  Object.defineProperty(globalThis, 'fetch', {
    value: boundFetch,
    writable: true,
    configurable: true,
    enumerable: false
  });
}

// 类似处理 Request, Response, Headers...
```

#### `src/polyfill.ts`
```typescript
console.log('=== polyfills.ts 开始执行 ===');

// 确保 globalThis 存在
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// 创建 Web API polyfill
const Request = function(input: any, init?: any) {
  this.url = input;
  this.method = (init && init.method) || 'GET';
  this.headers = new Headers(init && init.headers);
  // ... 其他属性
};

// 设置到全局对象
(globalThis as any).Request = Request;
(window as any).Request = Request;
```

### 3. 修改入口文件

#### `src/main.tsx`
```typescript
// 首先导入 polyfill
import './axios-polyfill'
import './polyfills'

// 然后导入其他模块
import React from 'react'
import ReactDOM from 'react-dom/client'
// ...
```

### 4. 强化 HTML Polyfill

#### `index.html`
```html
<script>
(function() {
  // 确保 globalThis 存在
  if (typeof globalThis === 'undefined') {
    window.globalThis = window;
  }
  
  // 创建简单 polyfill
  function createPolyfill() {
    const Request = function(input, init) { /* ... */ };
    const Response = function(body, init) { /* ... */ };
    const Headers = function(init) { /* ... */ };
    const fetch = function(input, init) { /* ... */ };
    return { Request, Response, Headers, fetch };
  }
  
  const polyfill = createPolyfill();
  globalThis.Request = polyfill.Request;
  globalThis.Response = polyfill.Response;
  globalThis.Headers = polyfill.Headers;
  globalThis.fetch = polyfill.fetch;
})();
</script>
```

### 5. 配置 Vite

#### `vite.config.ts`
```typescript
export default defineConfig({
  define: {
    'process.env': {},
    'process.browser': 'true',
    'process.version': '""',
    'process.versions': '{}',
    'process.platform': '"browser"',
  },
  optimizeDeps: {
    include: [
      '@cosmjs/cosmwasm-stargate',
      '@cosmjs/stargate',
      'axios',
    ],
    force: true,
  },
  build: {
    minify: false, // 暂时禁用压缩
  },
})
```

## 🔧 核心要点

### 1. 加载顺序
```typescript
// ✅ 正确顺序
import './axios-polyfill'  // 1. axios 修复
import './polyfills'       // 2. 通用 polyfill
import './main'            // 3. 应用代码
```

### 2. 全局对象
```javascript
// ✅ 确保存在
globalThis = globalThis || window;
global = global || globalThis;
```

### 3. Web API 绑定
```javascript
// ✅ 正确绑定
const boundAPI = originalAPI.bind(window);
Object.defineProperty(globalThis, 'api', {
  value: boundAPI,
  writable: true,
  configurable: true,
  enumerable: false
});
```

## 🚨 常见问题

### 1. "Illegal invocation" 错误
- **原因**: Web API 的 `this` 绑定丢失
- **解决**: 使用 `.bind(window)` 和 `Object.defineProperty`

### 2. "Cannot destructure property" 错误
- **原因**: `globalThis` 未定义
- **解决**: 在 HTML 中强制设置 `globalThis`

### 3. 构建失败
- **原因**: Vite 配置问题
- **解决**: 检查 `define` 和 `optimizeDeps` 配置

## 📊 验证清单

- [ ] 依赖已安装
- [ ] Polyfill 文件已创建
- [ ] 入口文件加载顺序正确
- [ ] HTML 中设置了全局 polyfill
- [ ] Vite 配置已更新
- [ ] 本地开发正常
- [ ] 生产构建成功
- [ ] 部署后运行正常

## 🎯 最佳实践

1. **始终在 HTML 中设置全局 polyfill**
2. **确保 polyfill 在模块加载前执行**
3. **使用 `Object.defineProperty` 设置全局属性**
4. **在 Vite 中预构建 CosmJS 依赖**
5. **暂时禁用压缩以排查问题**

---

**注意**: 这是基于实际项目经验的快速指南，详细说明请参考 `CosmJS集成问题解决方案.md`。
