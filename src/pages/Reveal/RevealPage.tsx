import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  TextField
} from '@mui/material'
import { Casino, AttachMoney, AutoMode, CheckCircle } from '@mui/icons-material'
import { useLottery } from '../../hooks/useLottery'
import { useWallet } from '../../hooks/useWallet'
import { useLotteryStore } from '../../store/lotteryStore'
import toast from 'react-hot-toast'

export const RevealPage: React.FC = () => {
  const { revealRandom, loading } = useLottery()
  const { isConnected, address } = useWallet()
  const { betRecords } = useLotteryStore()
  
  // 状态管理
  const [selectedBet, setSelectedBet] = useState<any>(null)
  const [autoReveal, setAutoReveal] = useState<boolean>(true)
  const [isRevealing, setIsRevealing] = useState<boolean>(false)
  const [revealStatus, setRevealStatus] = useState<string>('等待揭秘阶段')

  // 获取用户最近的投注记录
  useEffect(() => {
    if (address && betRecords.length > 0) {
      const userBets = betRecords.filter(bet => bet.player === address && !bet.revealed)
      if (userBets.length > 0) {
        // 选择最新的投注记录
        const latestBet = userBets[userBets.length - 1]
        setSelectedBet(latestBet)
      }
    }
  }, [address, betRecords])

  // 自动揭秘逻辑
  useEffect(() => {
    if (autoReveal && selectedBet && isConnected) {
      const checkRevealPhase = () => {
        // 这里应该检查区块链状态，判断是否进入揭秘阶段
        // 暂时使用模拟逻辑
        const currentTime = Date.now()
        const betTime = selectedBet.timestamp
        const timeDiff = currentTime - betTime
        
        // 模拟5分钟后进入揭秘阶段
        if (timeDiff > 5 * 60 * 1000) {
          setRevealStatus('可以揭秘')
          if (autoReveal) {
            handleAutoReveal()
          }
        } else {
          setRevealStatus(`等待揭秘阶段 (${Math.ceil((5 * 60 * 1000 - timeDiff) / 1000)}秒)`)
        }
      }
      
      const interval = setInterval(checkRevealPhase, 1000)
      return () => clearInterval(interval)
    }
  }, [autoReveal, selectedBet, isConnected])

  // 自动揭秘处理
  const handleAutoReveal = async () => {
    if (!selectedBet || isRevealing) return
    
    setIsRevealing(true)
    try {
      await revealRandom({
        luckyNumbers: selectedBet.numbers,
        randomSeed: selectedBet.randomSeed
      })
      
      toast.success('自动揭秘成功！')
      setRevealStatus('揭秘完成')
    } catch (error) {
      console.error('自动揭秘失败:', error)
      toast.error('自动揭秘失败，请手动确认')
    } finally {
      setIsRevealing(false)
    }
  }

  // 手动揭秘处理
  const handleManualReveal = async () => {
    if (!selectedBet || isRevealing) return
    
    setIsRevealing(true)
    try {
      await revealRandom({
        luckyNumbers: selectedBet.numbers,
        randomSeed: selectedBet.randomSeed
      })
      
      toast.success('手动揭秘成功！')
      setRevealStatus('揭秘完成')
    } catch (error) {
      console.error('手动揭秘失败:', error)
      toast.error('手动揭秘失败，请重试')
    } finally {
      setIsRevealing(false)
    }
  }

  if (!isConnected) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          请先连接钱包才能进行揭秘
        </Alert>
      </Box>
    )
  }

  if (!selectedBet) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="info" sx={{ mb: 3 }}>
          没有找到待揭秘的投注记录
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
        揭秘投注
      </Typography>

      <Grid container spacing={3}>
        {/* 左侧：投注信息显示 */}
        <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
              <Typography variant="h6" gutterBottom>
                投注信息 (只读)
              </Typography>
              
              {/* 投注摘要 */}
              <Box mb={3} p={2} bgcolor="grey.50" borderRadius={2}>
                <Typography variant="subtitle2" gutterBottom>
                  投注摘要
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>投注ID:</Typography>
                  <Typography variant="caption">{selectedBet.id}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>投注时间:</Typography>
                  <Typography variant="caption">
                    {new Date(selectedBet.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>投注金额:</Typography>
                  <Typography fontWeight="bold" color="primary">
                    {selectedBet.amount} LUCKEE
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>随机种子:</Typography>
                  <Typography variant="caption">{selectedBet.randomSeed}</Typography>
                </Box>
              </Box>

              {/* 幸运数字显示 */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  幸运数字 (已选择 {selectedBet.numbers.length} 个)
                </Typography>
                <Grid container spacing={1}>
                  {selectedBet.numbers.map((number: number) => (
                    <Grid item xs={1.2} sm={1} key={number}>
                      <Chip
                        label={`${number} (×${selectedBet.multipliers[number] || 1})`}
                        color="primary"
                        variant="filled"
                        size="small"
                        sx={{ 
                          width: '100%',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* 倍数详情 */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  倍数详情
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {Object.entries(selectedBet.multipliers).map(([number, multiplier]) => (
                    <Chip
                      key={number}
                      label={`${number}: ×${multiplier}`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 右侧：揭秘控制 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                揭秘控制
              </Typography>

              {/* 状态显示 */}
              <Box mb={3} p={2} bgcolor="info.light" borderRadius={2}>
                <Typography variant="body2" color="info.contrastText">
                  状态: {revealStatus}
                </Typography>
              </Box>

              {/* 自动揭秘开关 */}
              <Box mb={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoReveal}
                      onChange={(e) => setAutoReveal(e.target.checked)}
                      disabled={isRevealing}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AutoMode fontSize="small" />
                      <Typography>自动揭秘</Typography>
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  开启后将在可揭秘时自动发送交易
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 手动揭秘按钮 */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleManualReveal}
                disabled={isRevealing || revealStatus === '揭秘完成'}
                startIcon={<CheckCircle />}
                sx={{ mb: 2 }}
              >
                {isRevealing ? '揭秘中...' : '手动确认揭秘'}
              </Button>

              <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                手动揭秘需要您确认钱包交易
              </Typography>
          </CardContent>
        </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
