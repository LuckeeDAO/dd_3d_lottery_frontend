export enum WalletType {
  KEPLR = 'keplr',
  COSMOSTATION = 'cosmostation',
  LEAP = 'leap'
}

export interface WalletInfo {
  type: WalletType;
  address: string;
  pubKey: Uint8Array;
  algo: string;
  isNanoLedger: boolean;
}

export interface AccountInfo {
  address: string;
  pubKey: Uint8Array;
  algo: string;
  isNanoLedger: boolean;
}

export interface Balance {
  denom: string;
  amount: string;
}

export interface WalletError {
  code: string;
  message: string;
  details?: any;
}

export interface Transaction {
  msgs: any[];
  fee: any;
  memo?: string;
}

export interface TransactionResult {
  transactionHash: string;
  height: number;
  gasUsed: number;
  gasWanted: number;
}
