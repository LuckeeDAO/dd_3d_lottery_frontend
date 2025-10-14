import React from 'react';
import { Box, Button, Typography, Chip, Avatar } from '@mui/material';
import { AccountBalanceWallet, Logout } from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';
import { useLotteryStore } from '../store/lotteryStore';

const WalletStatus: React.FC = () => {
  const { address, isConnected, walletType, balance, disconnect } = useWallet();
  const { openWalletModal } = useLotteryStore();

  if (!isConnected || !address) {
    return (
      <Button
        variant="contained"
        startIcon={<AccountBalanceWallet />}
        onClick={openWalletModal}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
          py: 1
        }}
      >
        连接钱包
      </Button>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'keplr':
        return '🔑';
      case 'metamask':
        return '🦊';
      case 'cosmostation':
        return '🌌';
      default:
        return '💳';
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {getWalletIcon(walletType || '')}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {formatAddress(address)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            余额: {balance} LUCKEE
          </Typography>
        </Box>
      </Box>
      
      <Chip 
        label={walletType?.toUpperCase() || 'WALLET'} 
        size="small" 
        color="success" 
        variant="filled"
      />
      
      <Button
        variant="outlined"
        size="small"
        startIcon={<Logout />}
        onClick={disconnect}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          minWidth: 'auto'
        }}
      >
        断开
      </Button>
    </Box>
  );
};

export default WalletStatus;
