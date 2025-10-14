import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, LinearProgress, Tooltip } from '@mui/material';
import { CheckCircle, Error, Sync, Height } from '@mui/icons-material';
import { useLotteryStore } from '../store/lotteryStore';

const BlockchainStatus: React.FC = () => {
  const { currentBlockHeight, networkStatus, setBlockHeight, setNetworkStatus } = useLotteryStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // 模拟获取区块链状态
  useEffect(() => {
    const updateBlockHeight = async () => {
      setIsUpdating(true);
      try {
        // 这里应该调用实际的区块链API
        // 暂时使用模拟数据
        const mockHeight = Math.floor(Math.random() * 1000000) + 1000000;
        setBlockHeight(mockHeight);
        setNetworkStatus('connected');
      } catch (error) {
        console.error('获取区块高度失败:', error);
        setNetworkStatus('disconnected');
      } finally {
        setIsUpdating(false);
      }
    };

    // 初始加载
    updateBlockHeight();

    // 每30秒更新一次
    const interval = setInterval(updateBlockHeight, 30000);

    return () => clearInterval(interval);
  }, [setBlockHeight, setNetworkStatus]);

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'connected':
        return <CheckCircle color="success" fontSize="small" />;
      case 'connecting':
        return <Sync color="primary" fontSize="small" />;
      case 'disconnected':
        return <Error color="error" fontSize="small" />;
      default:
        return <Error color="error" fontSize="small" />;
    }
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'primary';
      case 'disconnected':
        return 'error';
      default:
        return 'error';
    }
  };

  const getStatusText = () => {
    switch (networkStatus) {
      case 'connected':
        return '已连接';
      case 'connecting':
        return '连接中';
      case 'disconnected':
        return '未连接';
      default:
        return '未知状态';
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        {getStatusIcon()}
        <Typography variant="body2" color="text.secondary">
          {getStatusText()}
        </Typography>
      </Box>

      <Chip
        icon={<Height />}
        label={`区块 #${currentBlockHeight.toLocaleString()}`}
        color={getStatusColor() as any}
        variant="outlined"
        size="small"
      />

      {isUpdating && (
        <Tooltip title="正在更新区块信息">
          <Box width={100}>
            <LinearProgress />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default BlockchainStatus;
