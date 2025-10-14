import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box } from '@mui/material';
import { Wallet } from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';
import { useLotteryStore } from '../store/lotteryStore';
import toast from 'react-hot-toast';

const WalletConnectModal: React.FC = () => {
  const { connect, disconnect, isConnected, address, walletType } = useWallet();
  const { isWalletModalOpen, closeWalletModal, setWalletInfo } = useLotteryStore();

  const handleConnect = async (type: 'keplr' | 'metamask' | 'cosmostation') => {
    try {
      console.log('尝试连接钱包:', type);
      console.log('window.keplr:', typeof window.keplr);
      console.log('window.ethereum:', typeof window.ethereum);
      console.log('window.cosmostation:', typeof window.cosmostation);
      
      await connect(type);
      closeWalletModal();
    } catch (error) {
      console.error('钱包连接失败:', error);
      // 显示更详细的错误信息
      if (error instanceof Error) {
        alert(`钱包连接失败: ${error.message}`);
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    closeWalletModal();
  };

  return (
    <Dialog open={isWalletModalOpen} onClose={closeWalletModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Wallet />
          <Typography variant="h6">连接钱包</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isConnected ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              已连接钱包: {address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              钱包类型: {walletType}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDisconnect}
              sx={{ mt: 2 }}
              fullWidth
            >
              断开连接
            </Button>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleConnect('keplr')}
              startIcon={<Wallet />}
              sx={{ py: 1.5 }}
              fullWidth
            >
              连接 Keplr 钱包
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleConnect('metamask')}
              startIcon={<Wallet />}
              sx={{ py: 1.5 }}
              fullWidth
            >
              连接 MetaMask 钱包
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleConnect('cosmostation')}
              startIcon={<Wallet />}
              sx={{ py: 1.5 }}
              fullWidth
            >
              连接 Cosmostation 钱包
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                // 模拟连接，用于测试
                const mockAddress = 'cosmos1test...' + Math.random().toString(36).substr(2, 9);
                setWalletInfo({
                  address: mockAddress,
                  walletType: 'keplr',
                  chainId: 'cosmoshub-4',
                  balance: '100.00'
                });
                closeWalletModal();
                toast.success('模拟钱包连接成功（仅用于测试）');
              }}
              sx={{ py: 1 }}
              fullWidth
            >
              模拟连接（测试用）
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeWalletModal}>取消</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WalletConnectModal;
