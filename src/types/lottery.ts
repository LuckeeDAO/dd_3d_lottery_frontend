export enum LotteryPhase {
  COMMITMENT = 'commitment',
  REVEAL = 'reveal',
  SETTLEMENT = 'settlement'
}

export interface LotterySession {
  sessionId: string;
  phase: LotteryPhase;
  totalPool: string;
  serviceFee: string;
  participants: Participant[];
  createdHeight: number;
  winningNumber?: number;
  settled: boolean;
}

export interface Participant {
  address: string;
  betAmount: string;
  betNumber: number;
  betMultiplier: number;
  randomSeed?: string;
  revealed: boolean;
  commitmentHash?: string;
}

export interface ParticipantInfo {
  address: string;
  betAmount: string;
  betNumber: number;
  betMultiplier: number;
  randomSeed?: string;
  revealed: boolean;
  commitmentHash?: string;
}

export interface LotteryResult {
  sessionId: string;
  winningNumber: number;
  winners: Winner[];
  totalRewards: string;
  settledHeight: number;
}

export interface Winner {
  address: string;
  rewardAmount: string;
  betNumber: number;
}

export interface PhaseInfo {
  phase: LotteryPhase;
  blockHeight: number;
  phaseMod: number;
}

export interface ContractConfig {
  admin: string;
  serviceFeeRate: string;
  minBetAmount: string;
  maxBetAmount: string;
  betDenom: string;
  paused: boolean;
  pauseRequested: boolean;
}

export interface StatsInfo {
  totalSessions: number;
  totalParticipants: number;
  totalPool: string;
  totalServiceFee: string;
  totalRewards: string;
}

export interface VersionInfo {
  contractName: string;
  contractVersion: string;
}

export interface PlaceBetData {
  betAmount: number;
  luckyNumbers: number[];
  randomSeed: string;
}

export interface RevealData {
  luckyNumbers: number[];
  randomSeed: string;
}
