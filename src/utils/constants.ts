export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'wallet_address',
  WALLET_TYPE: 'wallet_type',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_OPEN: 'sidebar_open',
  LAST_SESSION: 'last_session',
} as const

export const QUERY_KEYS = {
  wallet: ['wallet'] as const,
  account: () => [...QUERY_KEYS.wallet, 'account'] as const,
  balance: () => [...QUERY_KEYS.wallet, 'balance'] as const,
  
  lottery: ['lottery'] as const,
  currentSession: () => [...QUERY_KEYS.lottery, 'currentSession'] as const,
  participantInfo: (address: string) => [...QUERY_KEYS.lottery, 'participantInfo', address] as const,
  lotteryResult: (sessionId: string) => [...QUERY_KEYS.lottery, 'result', sessionId] as const,
  lotteryHistory: () => [...QUERY_KEYS.lottery, 'history'] as const,
  
  contract: ['contract'] as const,
  config: () => [...QUERY_KEYS.contract, 'config'] as const,
  stats: () => [...QUERY_KEYS.contract, 'stats'] as const,
  version: () => [...QUERY_KEYS.contract, 'version'] as const,
} as const

export const API_ENDPOINTS = {
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://rpc.cosmos.network',
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4',
} as const

export const PHASE_DURATIONS = {
  COMMITMENT: 6000, // 6秒
  REVEAL: 3000,     // 3秒
  SETTLEMENT: 1000, // 1秒
} as const

export const BET_LIMITS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 1000000,
  MAX_LUCKY_NUMBERS: 1000000,
} as const
