import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useLottery } from '@/hooks/useLottery'

export const ResultPage: React.FC = () => {
  const { currentSession } = useLottery()

  if (!currentSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              暂无彩票会话信息
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">彩票结果</h1>
          <p className="text-muted-foreground">
            查看最新的彩票结果和中奖信息
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>会话信息</CardTitle>
            <CardDescription>当前彩票会话的详细信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">会话ID</p>
                <p className="text-sm text-muted-foreground">{currentSession.sessionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">总奖金池</p>
                <p className="text-sm text-muted-foreground">{currentSession.totalPool} USDC</p>
              </div>
              <div>
                <p className="text-sm font-medium">参与者数量</p>
                <p className="text-sm text-muted-foreground">{currentSession.participants.length}人</p>
              </div>
              <div>
                <p className="text-sm font-medium">服务费</p>
                <p className="text-sm text-muted-foreground">{currentSession.serviceFee} USDC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentSession.winningNumber !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle>中奖号码</CardTitle>
              <CardDescription>本期彩票的中奖号码</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 text-2xl font-bold bg-primary text-primary-foreground rounded-full">
                  {currentSession.winningNumber}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentSession.participants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>参与者列表</CardTitle>
              <CardDescription>本期彩票的所有参与者</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentSession.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{participant.address}</p>
                      <p className="text-sm text-muted-foreground">
                        投注金额: {participant.betAmount} USDC
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={participant.revealed ? "success" : "destructive"}>
                        {participant.revealed ? "已揭秘" : "未揭秘"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
