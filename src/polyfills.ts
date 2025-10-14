// Polyfills for Node.js modules in browser environment
// This file handles the compatibility issues with CosmJS and other Node.js libraries

console.log('=== polyfills.ts 开始执行 ===')

// 确保globalThis存在
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

console.log('polyfills.ts 执行完成')

// Export for use in main application
export {};