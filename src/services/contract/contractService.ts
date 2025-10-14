import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { LotterySession, ParticipantInfo, LotteryResult, PhaseInfo, ContractConfig, StatsInfo, VersionInfo } from '@/types/lottery'

export interface ContractService {
  getCurrentSession(): Promise<LotterySession>;
  getParticipantInfo(address: string): Promise<ParticipantInfo>;
  getLotteryResult(sessionId: string): Promise<LotteryResult>;
  getCurrentPhase(): Promise<PhaseInfo>;
  getConfig(): Promise<ContractConfig>;
  getLotteryHistory(limit?: number, startAfter?: string): Promise<LotteryResult[]>;
  getParticipants(): Promise<any[]>;
  getStats(): Promise<StatsInfo>;
  getVersion(): Promise<VersionInfo>;
  placeBet(commitmentHash: string): Promise<string>;
  revealRandom(luckyNumbers: number[], randomSeed: string): Promise<string>;
  settleLottery(): Promise<string>;
}

class ContractServiceImpl implements ContractService {
  private client: CosmWasmClient | null = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || ''
  }

  private async getClient(): Promise<CosmWasmClient> {
    if (!this.client) {
      this.client = await CosmWasmClient.connect(import.meta.env.VITE_RPC_URL || 'https://rpc.cosmos.network')
    }
    return this.client
  }

  async getCurrentSession(): Promise<LotterySession> {
    const client = await this.getClient()
    const query = { get_current_session: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.session
    } catch (error) {
      // 返回模拟数据用于开发
      return {
        sessionId: 'session_001',
        phase: 'commitment' as any,
        totalPool: '1000000',
        serviceFee: '100000',
        participants: [],
        createdHeight: Date.now() / 1000,
        settled: false
      }
    }
  }

  async getParticipantInfo(address: string): Promise<ParticipantInfo> {
    const client = await this.getClient()
    const query = { get_participant_info: { participant: address } }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.participant
    } catch (error) {
      throw new Error('Failed to get participant info')
    }
  }

  async getLotteryResult(sessionId: string): Promise<LotteryResult> {
    const client = await this.getClient()
    const query = { get_lottery_result: { session_id: sessionId } }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.result
    } catch (error) {
      throw new Error('Failed to get lottery result')
    }
  }

  async getCurrentPhase(): Promise<PhaseInfo> {
    const client = await this.getClient()
    const query = { get_current_phase: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response
    } catch (error) {
      throw new Error('Failed to get current phase')
    }
  }

  async getConfig(): Promise<ContractConfig> {
    const client = await this.getClient()
    const query = { get_config: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.config
    } catch (error) {
      throw new Error('Failed to get config')
    }
  }

  async getLotteryHistory(limit: number = 10, startAfter?: string): Promise<LotteryResult[]> {
    const client = await this.getClient()
    const query = { get_lottery_history: { limit, start_after: startAfter } }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.results
    } catch (error) {
      throw new Error('Failed to get lottery history')
    }
  }

  async getParticipants(): Promise<any[]> {
    const client = await this.getClient()
    const query = { get_participants: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response.participants
    } catch (error) {
      throw new Error('Failed to get participants')
    }
  }

  async getStats(): Promise<StatsInfo> {
    const client = await this.getClient()
    const query = { get_stats: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response
    } catch (error) {
      throw new Error('Failed to get stats')
    }
  }

  async getVersion(): Promise<VersionInfo> {
    const client = await this.getClient()
    const query = { get_version: {} }
    
    try {
      const response = await client.queryContractSmart(this.contractAddress, query)
      return response
    } catch (error) {
      throw new Error('Failed to get version')
    }
  }

  async placeBet(commitmentHash: string): Promise<string> {
    const client = await this.getClient()
    const msg = { place_bet: { commitment_hash: commitmentHash } }
    
    try {
      const result = await client.execute(
        import.meta.env.VITE_SENDER_ADDRESS || '',
        this.contractAddress,
        msg,
        'auto'
      )
      return result.transactionHash
    } catch (error) {
      throw new Error('Failed to place bet')
    }
  }

  async revealRandom(luckyNumbers: number[], randomSeed: string): Promise<string> {
    const client = await this.getClient()
    const msg = { 
      reveal_random: { 
        lucky_numbers: luckyNumbers,
        random_seed: randomSeed
      } 
    }
    
    try {
      const result = await client.execute(
        import.meta.env.VITE_SENDER_ADDRESS || '',
        this.contractAddress,
        msg,
        'auto'
      )
      return result.transactionHash
    } catch (error) {
      throw new Error('Failed to reveal random')
    }
  }

  async settleLottery(): Promise<string> {
    const client = await this.getClient()
    const msg = { settle_lottery: {} }
    
    try {
      const result = await client.execute(
        import.meta.env.VITE_SENDER_ADDRESS || '',
        this.contractAddress,
        msg,
        'auto'
      )
      return result.transactionHash
    } catch (error) {
      throw new Error('Failed to settle lottery')
    }
  }
}

export const contractService = new ContractServiceImpl()
