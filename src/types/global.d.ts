// 全局类型声明

interface Window {
  keplr?: {
    getChainInfosWithoutEndpoints(): any[];
    experimentalSuggestChain(chainInfo: any): Promise<void>;
    enable(chainId: string): Promise<void>;
    getKey(chainId: string): Promise<any>;
    getOfflineSigner(chainId: string): any;
    signAmino(chainId: string, signer: string, signDoc: any): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: any): Promise<any>;
  };
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTrust?: boolean;
    isBraveWallet?: boolean;
    request(args: { method: string; params?: any[] }): Promise<any>;
    on(event: string, callback: (...args: any[]) => void): void;
    removeListener(event: string, callback: (...args: any[]) => void): void;
    selectedAddress?: string;
    chainId?: string;
  };
  cosmostation?: {
    cosmos: {
      request(args: { method: string; params?: any[] }): Promise<any>;
      on(event: string, callback: (...args: any[]) => void): void;
      removeListener(event: string, callback: (...args: any[]) => void): void;
    };
  };
  injective?: {
    isInjective?: boolean;
    request(args: { method: string; params?: any[] }): Promise<any>;
    on(event: string, callback: (...args: any[]) => void): void;
    removeListener(event: string, callback: (...args: any[]) => void): void;
  };
}

// 扩展PerformanceEntry类型
interface PerformanceEntry {
  transferSize?: number;
  responseEnd?: number;
}

// 声明全局变量
declare global {
  var ethereum: any;
  var keplr: any;
  var cosmostation: any;
  var injective: any;
}
