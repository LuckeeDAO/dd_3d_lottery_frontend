// 专门的axios polyfill文件
// 解决"Illegal invocation"错误

console.log('=== axios-polyfill.ts 开始执行 ===');

// 确保在axios加载之前设置正确的polyfill
if (typeof window !== 'undefined') {
  // 保存原始的Web API
  const originalFetch = window.fetch;
  const originalRequest = window.Request;
  const originalResponse = window.Response;
  const originalHeaders = window.Headers;

  // 创建正确的fetch polyfill
  if (originalFetch) {
    const boundFetch = originalFetch.bind(window);
    
    // 设置到所有全局对象
    (globalThis as any).fetch = boundFetch;
    (window as any).fetch = boundFetch;
    (globalThis as any).global = globalThis;
    (globalThis as any).fetch = boundFetch;
    
    // 使用Object.defineProperty确保不可枚举
    Object.defineProperty(globalThis, 'fetch', {
      value: boundFetch,
      writable: true,
      configurable: true,
      enumerable: false
    });
    
    Object.defineProperty(window, 'fetch', {
      value: boundFetch,
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  // 创建正确的Request polyfill
  if (originalRequest) {
    const boundRequest = originalRequest.bind(window);
    
    (globalThis as any).Request = boundRequest;
    (window as any).Request = boundRequest;
    (globalThis as any).global = globalThis;
    (globalThis as any).Request = boundRequest;
    
    // 保持原型链
    (globalThis as any).Request.prototype = originalRequest.prototype;
    (window as any).Request.prototype = originalRequest.prototype;
    (globalThis as any).Request.prototype = originalRequest.prototype;
  }

  // 创建正确的Response polyfill
  if (originalResponse) {
    const boundResponse = originalResponse.bind(window);
    
    (globalThis as any).Response = boundResponse;
    (window as any).Response = boundResponse;
    (globalThis as any).Response = boundResponse;
    
    // 保持原型链
    (globalThis as any).Response.prototype = originalResponse.prototype;
    (window as any).Response.prototype = originalResponse.prototype;
    (globalThis as any).Response.prototype = originalResponse.prototype;
  }

  // 创建正确的Headers polyfill
  if (originalHeaders) {
    const boundHeaders = originalHeaders.bind(window);
    
    (globalThis as any).Headers = boundHeaders;
    (window as any).Headers = boundHeaders;
    (globalThis as any).Headers = boundHeaders;
    
    // 保持原型链
    (globalThis as any).Headers.prototype = originalHeaders.prototype;
    (window as any).Headers.prototype = originalHeaders.prototype;
    (globalThis as any).Headers.prototype = originalHeaders.prototype;
  }

  // 添加process polyfill
  if (typeof (globalThis as any).process === 'undefined') {
    (globalThis as any).process = {
      env: {},
      browser: true,
      version: '',
      versions: {},
      platform: 'browser',
      nextTick: (fn: Function) => setTimeout(fn, 0),
      hrtime: () => [0, 0],
      uptime: () => 0
    };
  }

  console.log('axios-polyfill.ts 设置完成:', {
    fetch: typeof (globalThis as any).fetch,
    Request: typeof (globalThis as any).Request,
    Response: typeof (globalThis as any).Response,
    Headers: typeof (globalThis as any).Headers,
    process: typeof (globalThis as any).process
  });
}

console.log('=== axios-polyfill.ts 执行完成 ===');
