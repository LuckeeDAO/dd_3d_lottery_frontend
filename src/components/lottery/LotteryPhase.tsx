import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useLottery } from '@/hooks/useLottery'
import { LotteryPhase as Phase } from '@/types/lottery'
// import { formatPhase } from '@/utils/formatters'

export const LotteryPhase: React.FC = () => {
  const { currentSession, phase, timeRemaining } = useLottery()

  const getPhaseInfo = (phase: Phase) => {
    switch (phase) {
      case Phase.COMMITMENT:
        return {
          title: '承诺阶段',
          description: '提交您的投注承诺',
          color: 'bg-blue-500',
          badge: '投注中'
        };
      case Phase.REVEAL:
        return {
          title: '揭秘阶段',
          description: '揭示您的随机数和幸运数字',
          color: 'bg-yellow-500',
          badge: '揭秘中'
        };
      case Phase.SETTLEMENT:
        return {
          title: '结算阶段',
          description: '计算中奖号码并分配奖金',
          color: 'bg-green-500',
          badge: '结算中'
        };
      default:
        return {
          title: '未知阶段',
          description: '系统状态异常',
          color: 'bg-gray-500',
          badge: '未知'
        };
    }
  }

  const phaseInfo = getPhaseInfo(phase)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>当前阶段</span>
          <Badge variant="outline">{phaseInfo.badge}</Badge>
        </CardTitle>
        <CardDescription>{phaseInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${phaseInfo.color}`} />
            <span className="font-medium">{phaseInfo.title}</span>
          </div>
          {timeRemaining > 0 && (
            <div className="text-sm text-muted-foreground">
              剩余时间: {Math.floor(timeRemaining / 60)}分{timeRemaining % 60}秒
            </div>
          )}
          {currentSession && (
            <div className="text-sm">
              <p>会话ID: {currentSession.sessionId}</p>
              <p>总奖金池: {currentSession.totalPool} USDC</p>
              <p>参与者: {currentSession.participants.length}人</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
