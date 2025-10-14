import React from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { Schedule, Visibility, EmojiEvents } from '@mui/icons-material';
import { useLotteryStore } from '../store/lotteryStore';

const LotteryPhase: React.FC = () => {
  const { currentRound } = useLotteryStore();

  if (!currentRound) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          暂无进行中的彩票轮次
        </Typography>
      </Box>
    );
  }

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'commitment':
        return {
          label: '投注阶段',
          description: '提交投注号码和金额',
          icon: <Schedule />,
          color: 'primary' as const,
          progress: 33
        };
      case 'reveal':
        return {
          label: '开奖阶段',
          description: '揭示投注号码',
          icon: <Visibility />,
          color: 'secondary' as const,
          progress: 66
        };
      case 'settlement':
        return {
          label: '结算阶段',
          description: '分配奖金和奖励',
          icon: <EmojiEvents />,
          color: 'success' as const,
          progress: 100
        };
      default:
        return {
          label: '未知阶段',
          description: '状态未知',
          icon: <Schedule />,
          color: 'default' as const,
          progress: 0
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentRound.phase);
  const now = Date.now();
  const timeRemaining = currentRound.endTime - now;
  const isExpired = timeRemaining <= 0;

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return '已结束';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h6">
          第 {currentRound.id} 轮彩票
        </Typography>
        <Chip
          icon={phaseInfo.icon}
          label={phaseInfo.label}
          color={phaseInfo.color}
          variant="filled"
        />
      </Box>

      <Box mb={2}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {phaseInfo.description}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={phaseInfo.progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              backgroundColor: phaseInfo.color === 'default' ? 'grey.400' : undefined
            }
          }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">
            剩余时间
          </Typography>
          <Typography variant="h6" color={isExpired ? 'error.main' : 'primary.main'}>
            {formatTimeRemaining(timeRemaining)}
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="body2" color="text.secondary">
            总投注
          </Typography>
          <Typography variant="h6">
            {currentRound.totalBets} 注
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="body2" color="text.secondary">
            总金额
          </Typography>
          <Typography variant="h6">
            {currentRound.totalAmount} LUCKEE
          </Typography>
        </Box>
      </Box>

      {currentRound.winningNumber && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            中奖号码
          </Typography>
          <Typography variant="h4" color="success.main" fontWeight="bold">
            {currentRound.winningNumber}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LotteryPhase;
