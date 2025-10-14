// Web API Polyfill for CosmJS
// 必须在任何其他模块导入之前执行

// 确保globalThis存在
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// 检查浏览器是否原生支持这些API
const hasNativeRequest = typeof window.Request !== 'undefined';
const hasNativeResponse = typeof window.Response !== 'undefined';
const hasNativeHeaders = typeof window.Headers !== 'undefined';
const hasNativeFetch = typeof window.fetch !== 'undefined';

// 创建完整的Request polyfill
if (!hasNativeRequest) {
  (globalThis as any).Request = function(input: any, init?: any) {
    this.url = input;
    this.method = (init && init.method) || 'GET';
    this.headers = new (globalThis as any).Headers(init && init.headers);
    this.body = init && init.body;
    this.mode = (init && init.mode) || 'cors';
    this.credentials = (init && init.credentials) || 'same-origin';
    this.cache = (init && init.cache) || 'default';
    this.redirect = (init && init.redirect) || 'follow';
    this.referrer = (init && init.referrer) || 'about:client';
    this.signal = (init && init.signal) || null;
  };
} else {
  (globalThis as any).Request = window.Request;
}

// 创建完整的Response polyfill
if (!hasNativeResponse) {
  (globalThis as any).Response = function(body: any, init?: any) {
    this.body = body;
    this.status = (init && init.status) || 200;
    this.statusText = (init && init.statusText) || 'OK';
    this.headers = new (globalThis as any).Headers(init && init.headers);
    this.ok = this.status >= 200 && this.status < 300;
    this.type = 'basic';
    this.url = '';
    this.redirected = false;
  };
} else {
  (globalThis as any).Response = window.Response;
}

// 创建完整的Headers polyfill
if (!hasNativeHeaders) {
  (globalThis as any).Headers = function(init?: any) {
    this._headers = {};
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]: [string, string]) => {
          this._headers[key.toLowerCase()] = value;
        });
      } else if (typeof init === 'object') {
        Object.keys(init).forEach(key => {
          this._headers[key.toLowerCase()] = init[key];
        });
      }
    }
  };
  
  (globalThis as any).Headers.prototype.get = function(name: string) {
    return this._headers[name.toLowerCase()] || null;
  };
  
  (globalThis as any).Headers.prototype.set = function(name: string, value: string) {
    this._headers[name.toLowerCase()] = value;
  };
  
  (globalThis as any).Headers.prototype.has = function(name: string) {
    return name.toLowerCase() in this._headers;
  };
  
  (globalThis as any).Headers.prototype.delete = function(name: string) {
    delete this._headers[name.toLowerCase()];
  };
  
  (globalThis as any).Headers.prototype.entries = function() {
    return Object.entries(this._headers)[Symbol.iterator]();
  };
  
  (globalThis as any).Headers.prototype.keys = function() {
    return Object.keys(this._headers)[Symbol.iterator]();
  };
  
  (globalThis as any).Headers.prototype.values = function() {
    return Object.values(this._headers)[Symbol.iterator]();
  };
  
  (globalThis as any).Headers.prototype[Symbol.iterator] = function() {
    return this.entries();
  };
} else {
  (globalThis as any).Headers = window.Headers;
}

// 创建fetch polyfill
if (!hasNativeFetch) {
  (globalThis as any).fetch = function(input: any, init?: any) {
    return Promise.reject(new Error('fetch not available'));
  };
} else {
  (globalThis as any).fetch = window.fetch.bind(window);
}

// 确保这些对象在全局作用域中可用
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// 修复axios的"Illegal invocation"错误
// 确保所有Web API都有正确的this绑定
const originalFetch = window.fetch;
if (originalFetch) {
  (globalThis as any).fetch = function(...args: any[]) {
    return originalFetch.apply(window, args);
  };
  
  // 确保fetch在全局作用域中正确绑定
  (window as any).fetch = function(...args: any[]) {
    return originalFetch.apply(window, args);
  };
  
  // 修复globalThis中的fetch
  Object.defineProperty(globalThis, 'fetch', {
    value: function(...args: any[]) {
      return originalFetch.apply(window, args);
    },
    writable: true,
    configurable: true,
    enumerable: false
  });
}

// 修复Request和Response的this绑定问题
const originalRequest = window.Request;
if (originalRequest) {
  (globalThis as any).Request = function(...args: any[]) {
    return new originalRequest(...args);
  };
  (globalThis as any).Request.prototype = originalRequest.prototype;
}

const originalResponse = window.Response;
if (originalResponse) {
  (globalThis as any).Response = function(...args: any[]) {
    return new originalResponse(...args);
  };
  (globalThis as any).Response.prototype = originalResponse.prototype;
}

const originalHeaders = window.Headers;
if (originalHeaders) {
  (globalThis as any).Headers = function(...args: any[]) {
    return new originalHeaders(...args);
  };
  (globalThis as any).Headers.prototype = originalHeaders.prototype;
}

// 设置到所有全局对象
(window as any).Request = (globalThis as any).Request;
(window as any).Response = (globalThis as any).Response;
(window as any).Headers = (globalThis as any).Headers;
(window as any).fetch = (globalThis as any).fetch;

(global as any).Request = (globalThis as any).Request;
(global as any).Response = (globalThis as any).Response;
(global as any).Headers = (globalThis as any).Headers;
(global as any).fetch = (globalThis as any).fetch;

// 强制设置到globalThis的各个属性
Object.defineProperty(globalThis, 'Request', {
  value: (globalThis as any).Request,
  writable: true,
  configurable: true,
  enumerable: false
});

Object.defineProperty(globalThis, 'Response', {
  value: (globalThis as any).Response,
  writable: true,
  configurable: true,
  enumerable: false
});

Object.defineProperty(globalThis, 'Headers', {
  value: (globalThis as any).Headers,
  writable: true,
  configurable: true,
  enumerable: false
});

Object.defineProperty(globalThis, 'fetch', {
  value: (globalThis as any).fetch,
  writable: true,
  configurable: true,
  enumerable: false
});

console.log('Web API polyfill loaded:', {
  Request: typeof (globalThis as any).Request,
  Response: typeof (globalThis as any).Response,
  Headers: typeof (globalThis as any).Headers,
  fetch: typeof (globalThis as any).fetch,
  globalRequest: typeof (global as any).Request,
  globalResponse: typeof (global as any).Response,
  globalHeaders: typeof (global as any).Headers,
  nativeSupport: {
    Request: hasNativeRequest,
    Response: hasNativeResponse,
    Headers: hasNativeHeaders,
    fetch: hasNativeFetch
  }
});

// 添加更全面的axios兼容性修复
// 确保所有Web API在全局作用域中正确可用
if (typeof window !== 'undefined') {
  // 修复全局作用域中的Web API
  (window as any).Request = (globalThis as any).Request;
  (window as any).Response = (globalThis as any).Response;
  (window as any).Headers = (globalThis as any).Headers;
  (window as any).fetch = (globalThis as any).fetch;
  
  // 确保这些API在global对象中也可用
  (globalThis as any).global = globalThis;
  (globalThis as any).Request = (globalThis as any).Request;
  (globalThis as any).Response = (globalThis as any).Response;
  (globalThis as any).Headers = (globalThis as any).Headers;
  (globalThis as any).fetch = (globalThis as any).fetch;
}

// 添加process polyfill以支持axios
if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = {
    env: {},
    browser: true,
    version: '',
    versions: {},
    platform: 'browser'
  };
}

// 验证设置是否成功
if (typeof (globalThis as any).Request === 'undefined') {
  console.error('Failed to set Request polyfill');
}
if (typeof (globalThis as any).Response === 'undefined') {
  console.error('Failed to set Response polyfill');
}
if (typeof (globalThis as any).Headers === 'undefined') {
  console.error('Failed to set Headers polyfill');
}
if (typeof (globalThis as any).fetch === 'undefined') {
  console.error('Failed to set fetch polyfill');
}

console.log('Enhanced polyfill setup completed:', {
  globalThis: {
    Request: typeof (globalThis as any).Request,
    Response: typeof (globalThis as any).Response,
    Headers: typeof (globalThis as any).Headers,
    fetch: typeof (globalThis as any).fetch,
    process: typeof (globalThis as any).process
  },
  window: {
    Request: typeof (window as any).Request,
    Response: typeof (window as any).Response,
    Headers: typeof (window as any).Headers,
    fetch: typeof (window as any).fetch
  }
});
