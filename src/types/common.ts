export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export interface WalletError extends AppError {
  type: 'wallet';
  walletType?: string;
}

export interface ContractError extends AppError {
  type: 'contract';
  method?: string;
  params?: any;
}

export interface NetworkError extends AppError {
  type: 'network';
  url?: string;
  status?: number;
}

export interface ValidationError extends AppError {
  type: 'validation';
  field?: string;
  value?: any;
}

export interface StorageChange {
  key: string;
  oldValue: any;
  newValue: any;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
