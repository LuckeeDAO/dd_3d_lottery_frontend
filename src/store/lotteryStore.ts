import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletInfo {
  address: string;
  walletType: 'keplr' | 'metamask' | 'cosmostation';
  chainId: string;
  balance: string;
}

export interface LotteryRound {
  id: string;
  phase: 'commitment' | 'reveal' | 'settlement';
  startTime: number;
  endTime: number;
  totalBets: number;
  totalAmount: string;
  winningNumber?: number;
  blockHeight: number;
}

export interface BetRecord {
  id: string;
  roundId: string;
  player: string;
  numbers: number[];
  amount: string;
  timestamp: number;
  revealed: boolean;
  won: boolean;
  reward?: string;
}

export interface LotteryStats {
  totalRounds: number;
  totalBets: number;
  totalWinners: number;
  totalRewards: string;
  numberFrequency: Record<number, number>;
  averageBetAmount: string;
  winRate: number;
}

interface LotteryStore {
  // 钱包相关
  wallet: WalletInfo | null;
  isConnected: boolean;
  isWalletModalOpen: boolean;
  
  // 彩票相关
  currentRound: LotteryRound | null;
  betHistory: BetRecord[];
  lotteryStats: LotteryStats | null;
  
  // 区块链状态
  currentBlockHeight: number;
  networkStatus: 'connected' | 'disconnected' | 'connecting';
  
  // 钱包操作
  setWalletInfo: (info: WalletInfo) => void;
  clearWalletInfo: () => void;
  updateBalance: (balance: string) => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  
  // 彩票操作
  setCurrentRound: (round: LotteryRound) => void;
  addBetRecord: (bet: BetRecord) => void;
  updateBetRecord: (id: string, updates: Partial<BetRecord>) => void;
  setLotteryStats: (stats: LotteryStats) => void;
  
  // 区块链操作
  setBlockHeight: (height: number) => void;
  setNetworkStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
  
  // 计算属性
  getAddress: () => string | null;
  getWalletType: () => string | null;
  getBalance: () => string;
  isWalletConnected: () => boolean;
}

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      wallet: null,
      isConnected: false,
      isWalletModalOpen: false,
      currentRound: null,
      betHistory: [],
      lotteryStats: null,
      currentBlockHeight: 0,
      networkStatus: 'disconnected',
      
      // 钱包操作
      setWalletInfo: (info: WalletInfo) => set({
        wallet: info,
        isConnected: true
      }),
      
      clearWalletInfo: () => set({
        wallet: null,
        isConnected: false
      }),
      
      updateBalance: (balance: string) => set((state) => ({
        wallet: state.wallet ? { ...state.wallet, balance } : null
      })),
      
      openWalletModal: () => set({ isWalletModalOpen: true }),
      closeWalletModal: () => set({ isWalletModalOpen: false }),
      
      // 彩票操作
      setCurrentRound: (round: LotteryRound) => set({ currentRound: round }),
      
      addBetRecord: (bet: BetRecord) => set((state) => ({
        betHistory: [...state.betHistory, bet]
      })),
      
      updateBetRecord: (id: string, updates: Partial<BetRecord>) => set((state) => ({
        betHistory: state.betHistory.map(bet => 
          bet.id === id ? { ...bet, ...updates } : bet
        )
      })),
      
      setLotteryStats: (stats: LotteryStats) => set({ lotteryStats: stats }),
      
      // 区块链操作
      setBlockHeight: (height: number) => set({ currentBlockHeight: height }),
      setNetworkStatus: (status: 'connected' | 'disconnected' | 'connecting') => set({ networkStatus: status }),
      
      // 计算属性
      getAddress: () => get().wallet?.address || null,
      getWalletType: () => get().wallet?.walletType || null,
      getBalance: () => get().wallet?.balance || '0',
      isWalletConnected: () => get().isConnected && get().wallet !== null,
    }),
    {
      name: 'lottery-storage',
      partialize: (state) => ({
        wallet: state.wallet,
        isConnected: state.isConnected,
        betHistory: state.betHistory,
      }),
    }
  )
);

// 导出类型
export type { WalletInfo, LotteryRound, BetRecord, LotteryStats };
