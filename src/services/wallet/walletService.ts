import { WalletType, WalletInfo, AccountInfo, Balance, Transaction, TransactionResult } from '@/types/wallet'

export interface WalletService {
  connect(walletType: WalletType): Promise<WalletInfo>;
  disconnect(): Promise<void>;
  getAccount(): Promise<AccountInfo>;
  getBalance(denom: string): Promise<Balance>;
  sendTransaction(tx: Transaction): Promise<TransactionResult>;
  signMessage(message: string): Promise<string>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}

class WalletServiceImpl implements WalletService {
  private wallet: any = null;
  private listeners: Map<string, Function[]> = new Map();

  async connect(walletType: WalletType): Promise<WalletInfo> {
    try {
      switch (walletType) {
        case WalletType.KEPLR:
          return await this.connectKeplr();
        case WalletType.COSMOSTATION:
          return await this.connectCosmostation();
        default:
          throw new Error('Unsupported wallet type');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  private async connectKeplr(): Promise<WalletInfo> {
    // 等待钱包加载
    if (!window.keplr) {
      throw new Error('Keplr wallet not found');
    }

    try {
      const chainId = import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4';
      await window.keplr.enable(chainId);
      this.wallet = window.keplr;
      const account = await this.wallet.getKey(chainId);
      
      const walletInfo: WalletInfo = {
        type: WalletType.KEPLR,
        address: account.bech32Address,
        pubKey: account.pubKey,
        algo: account.algo,
        isNanoLedger: account.isNanoLedger
      };
      
      this.emit('connected', walletInfo);
      return walletInfo;
    } catch (error) {
      throw new Error('Failed to enable Keplr wallet');
    }
  }

  private async connectCosmostation(): Promise<WalletInfo> {
    if (!window.cosmostation) {
      throw new Error('Cosmostation wallet not found');
    }

    try {
      await window.cosmostation.cosmos.request({
        method: 'cosmos_requestAccount',
        params: { chainName: import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4' }
      });
      this.wallet = window.cosmostation;
      
      // 模拟账户信息
      const walletInfo: WalletInfo = {
        type: WalletType.COSMOSTATION,
        address: 'cosmwasm1test...',
        pubKey: new Uint8Array(),
        algo: 'secp256k1',
        isNanoLedger: false
      };
      
      this.emit('connected', walletInfo);
      return walletInfo;
    } catch (error) {
      throw new Error('Failed to connect Cosmostation wallet');
    }
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    this.emit('disconnected', {});
  }

  async getAccount(): Promise<AccountInfo> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const account = await this.wallet.getKey(import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4');
      return {
        address: account.bech32Address,
        pubKey: account.pubKey,
        algo: account.algo,
        isNanoLedger: account.isNanoLedger
      };
    } catch (error) {
      throw new Error('Failed to get account info');
    }
  }

  async getBalance(denom: string): Promise<Balance> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const account = await this.getAccount();
      const response = await fetch(
        `${import.meta.env.VITE_RPC_URL || 'https://rpc.cosmos.network'}/cosmos/bank/v1beta1/balances/${account.address}`
      );
      const data = await response.json();
      
      const balance = data.balances.find((b: any) => b.denom === denom);
      return {
        denom,
        amount: balance ? balance.amount : '0'
      };
    } catch (error) {
      throw new Error('Failed to get balance');
    }
  }

  async sendTransaction(tx: Transaction): Promise<TransactionResult> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await this.wallet.signAndBroadcast(
        import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4',
        tx
      );
      return {
        transactionHash: result.transactionHash,
        height: result.height,
        gasUsed: result.gasUsed,
        gasWanted: result.gasWanted
      };
    } catch (error) {
      throw new Error('Failed to send transaction');
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await this.wallet.signMessage(
        import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4',
        message
      );
      return result.signature;
    } catch (error) {
      throw new Error('Failed to sign message');
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  private emit(event: string, data: any): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(callback => callback(data));
  }
}

export const walletService = new WalletServiceImpl();

// 扩展Window接口
declare global {
  interface Window {
    keplr?: any;
    cosmostation?: any;
  }
}
