import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contractService } from '@/services/contract/contractService'
import { LotterySession, ParticipantInfo, LotteryResult, PlaceBetData, RevealData } from '@/types/lottery'
import { LotteryPhase } from '@/types/lottery'
import { QUERY_KEYS } from '@/utils/constants'

export const useLottery = () => {
  const [phase, setPhase] = useState<LotteryPhase>(LotteryPhase.COMMITMENT)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const queryClient = useQueryClient()

  // 查询当前会话
  const { data: currentSession, isLoading: sessionLoading } = useQuery<LotterySession>({
    queryKey: QUERY_KEYS.currentSession(),
    queryFn: () => contractService.getCurrentSession(),
    refetchInterval: 5000
  })

  // 查询参与者信息
  const { data: participantInfo } = useQuery<ParticipantInfo>({
    queryKey: QUERY_KEYS.participantInfo(''),
    queryFn: () => contractService.getParticipantInfo(''),
    enabled: false
  })

  // 投注操作
  const placeBetMutation = useMutation({
    mutationFn: (data: PlaceBetData) => {
      // 生成承诺哈希
      const commitmentHash = generateCommitmentHash(data.luckyNumbers, data.randomSeed)
      return contractService.placeBet(commitmentHash)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lottery })
    }
  })

  // 揭秘操作
  const revealMutation = useMutation({
    mutationFn: (data: RevealData) => {
      return contractService.revealRandom(data.luckyNumbers, data.randomSeed)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lottery })
    }
  })

  // 结算操作
  const settleMutation = useMutation({
    mutationFn: () => contractService.settleLottery(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lottery })
    }
  })

  // 计算阶段和剩余时间
  useEffect(() => {
    if (currentSession) {
      const now = Date.now()
      const sessionStart = currentSession.createdHeight * 1000 // 假设每个区块1秒
      const elapsed = now - sessionStart
      const phaseMod = Math.floor(elapsed / 10000) % 3
      
      switch (phaseMod) {
        case 0:
          setPhase(LotteryPhase.COMMITMENT)
          setTimeRemaining(6000 - (elapsed % 10000))
          break;
        case 1:
          setPhase(LotteryPhase.REVEAL)
          setTimeRemaining(3000 - (elapsed % 10000))
          break;
        case 2:
          setPhase(LotteryPhase.SETTLEMENT)
          setTimeRemaining(1000 - (elapsed % 10000))
          break;
      }
    }
  }, [currentSession])

  const placeBet = (data: PlaceBetData) => {
    placeBetMutation.mutate(data)
  }

  const revealRandom = (data: RevealData) => {
    revealMutation.mutate(data)
  }

  const settleLottery = () => {
    settleMutation.mutate()
  }

  return {
    currentSession,
    phase,
    timeRemaining,
    participantInfo,
    loading: sessionLoading || placeBetMutation.isPending || revealMutation.isPending || settleMutation.isPending,
    placeBet,
    revealRandom,
    settleLottery
  }
}

// 生成承诺哈希
function generateCommitmentHash(luckyNumbers: number[], randomSeed: string): string {
  const data = JSON.stringify({ luckyNumbers, randomSeed })
  // 这里应该使用实际的哈希函数
  return btoa(data)
}
