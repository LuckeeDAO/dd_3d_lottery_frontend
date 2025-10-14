import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Container,
  Alert,
  Chip,
  CardActions,
  Divider
} from '@mui/material'
import { 
  Casino, 
  TrendingUp, 
  People, 
  AttachMoney,
  Security,
  Speed,
  History,
  EmojiEvents,
  Visibility,
  Analytics,
  AccountBalance,
  HowToVote
} from '@mui/icons-material'
import { useWallet } from '../../hooks/useWallet'
import { useLotteryStore } from '../../store/lotteryStore'

export const HomePage: React.FC = () => {
  const { isConnected, address, balance } = useWallet()
  const { currentRound, lotteryStats, openWalletModal } = useLotteryStore()

  // 模拟统计数据
  const stats = [
    {
      title: '当前轮次',
      value: currentRound?.id || '0',
      icon: <Casino />,
      color: 'primary',
      change: '+1',
    },
    {
      title: '总投注数',
      value: lotteryStats?.totalBets || '1,234',
      icon: <HowToVote />,
      color: 'success',
      change: '+12%',
    },
    {
      title: '中奖次数',
      value: lotteryStats?.totalWinners || '89',
      icon: <EmojiEvents />,
      color: 'warning',
      change: '+5%',
    },
    {
      title: '系统状态',
      value: '正常',
      icon: <Security />,
      color: 'success',
      change: '100%',
    },
  ]

  // 最近活动
  const recentActivities = [
    {
      title: '新投注提交',
      description: '用户提交了新的3D彩票投注',
      time: '2分钟前',
      type: 'bet',
    },
    {
      title: '开奖完成',
      description: '第123轮彩票开奖完成，中奖号码：456',
      time: '1小时前',
      type: 'reveal',
    },
    {
      title: '奖金发放',
      description: '中奖用户成功领取奖金 1,000 LUCKEE',
      time: '2小时前',
      type: 'reward',
    },
    {
      title: '新轮次开始',
      description: '第124轮彩票投注阶段开始',
      time: '3小时前',
      type: 'round',
    },
  ]

  const features = [
    {
      icon: <Security />,
      title: '去中心化',
      description: '基于区块链技术，确保公平透明'
    },
    {
      icon: <Speed />,
      title: '快速结算',
      description: '智能合约自动执行，无需人工干预'
    },
    {
      icon: <TrendingUp />,
      title: '数据分析',
      description: '提供详细的投注数据分析和统计'
    },
    {
      icon: <People />,
      title: '社区驱动',
      description: '由社区治理，用户参与决策'
    }
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'bet':
        return 'primary'
      case 'reveal':
        return 'success'
      case 'reward':
        return 'warning'
      case 'round':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        {/* 欢迎区域 */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            <Casino sx={{ mr: 2, verticalAlign: 'middle' }} />
            DD 3D 彩票
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            去中心化3D彩票游戏平台
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            基于CosmWasm智能合约的公平、透明、安全的彩票游戏。
            支持多种钱包连接，提供丰富的投注选项和数据分析功能。
          </Typography>
        </Box>

        {/* 钱包状态显示 */}
        {isConnected ? (
          <Alert severity="success" sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2">
                  钱包已连接: {address?.slice(0, 6)}...{address?.slice(-4)}
                </Typography>
                {balance && (
                  <Typography variant="body2">
                    余额: {balance} LUCKEE
                  </Typography>
                )}
              </Box>
              <Button size="small" variant="outlined">
                管理钱包
              </Button>
            </Box>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              请先连接钱包以开始使用DD 3D彩票系统
            </Typography>
          </Alert>
        )}

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${stat.color}.main`, mr: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" component="div">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Chip
                    label={stat.change}
                    color={stat.color as any}
                    size="small"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 功能特性 */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 最近活动和快速操作 */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  最近活动
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {recentActivities.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: index < recentActivities.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Chip
                        label={activity.type}
                        color={getActivityColor(activity.type) as any}
                        size="small"
                        sx={{ mr: 2, minWidth: 80 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" component="div">
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" href="/history">查看全部</Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  快速操作
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    href="/bet"
                    startIcon={<Casino />}
                  >
                    立即投注
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    href="/reveal"
                    startIcon={<Visibility />}
                  >
                    查看开奖
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    href="/result"
                    startIcon={<EmojiEvents />}
                  >
                    查看结果
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    href="/analysis"
                    startIcon={<Analytics />}
                  >
                    数据分析
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 快速开始 */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              快速开始
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              开始您的DD 3D彩票之旅，体验去中心化彩票的乐趣！
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {isConnected ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    href="/bet"
                    startIcon={<Casino />}
                  >
                    立即投注
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/history"
                  >
                    查看历史
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/analysis"
                  >
                    数据分析
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  请先连接钱包以开始使用DD 3D彩票系统
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
