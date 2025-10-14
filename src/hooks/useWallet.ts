import { useCallback, useEffect } from 'react';
import { useLotteryStore } from '../store/lotteryStore';
import toast from 'react-hot-toast';

// 扩展Window接口
declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
    cosmostation?: any;
  }
}

export const useWallet = () => {
  const {
    wallet,
    isConnected,
    setWalletInfo,
    clearWalletInfo,
    updateBalance
  } = useLotteryStore();
  
  const address = wallet?.address;
  const walletType = wallet?.walletType;
  const balance = wallet?.balance;

  const connect = useCallback(async (walletType: 'keplr' | 'metamask' | 'cosmostation'): Promise<string | null> => {
    try {
      if (walletType === 'keplr') {
        return await connectKeplr();
      } else if (walletType === 'metamask') {
        return await connectMetamask();
      } else if (walletType === 'cosmostation') {
        return await connectCosmostation();
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接钱包失败';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const connectKeplr = async (): Promise<string | null> => {
    if (typeof window.keplr === 'undefined') {
      throw new Error('Keplr钱包未安装，请先安装Keplr扩展');
    }

    try {
      const chainId = import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4';
      
      // 启用Keplr
      await window.keplr.enable(chainId);
      
      // 获取账户信息
      const key = await window.keplr.getKey(chainId);
      const address = key.bech32Address;
      
      if (address) {
        setWalletInfo({
          address,
          walletType: 'keplr',
          chainId,
          balance: '0'
        });
        
        // 获取余额
        await updateWalletBalance(address);
        
        toast.success('Keplr钱包连接成功');
        return address;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          throw new Error('用户取消了连接请求');
        }
      }
      throw error;
    }
  };

  const connectMetamask = async (): Promise<string | null> => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask钱包未安装，请先安装MetaMask扩展');
    }

    try {
      // 请求连接账户
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWalletInfo({
          address,
          walletType: 'metamask',
          chainId: `0x${parseInt(chainId).toString(16)}`,
          balance: '0'
        });
        
        // 获取余额
        await updateWalletBalance(address);
        
        toast.success('MetaMask钱包连接成功');
        return address;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          throw new Error('用户取消了连接请求');
        }
      }
      throw error;
    }
  };

  const connectCosmostation = async (): Promise<string | null> => {
    if (typeof window.cosmostation === 'undefined') {
      throw new Error('Cosmostation钱包未安装，请先安装Cosmostation扩展');
    }

    try {
      const chainId = import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4';
      
      // 请求连接
      const result = await window.cosmostation.cosmos.request({
        method: 'cos_requestAccount',
        params: { chainName: chainId }
      });
      
      if (result && result.address) {
        setWalletInfo({
          address: result.address,
          walletType: 'cosmostation',
          chainId,
          balance: '0'
        });
        
        // 获取余额
        await updateWalletBalance(result.address);
        
        toast.success('Cosmostation钱包连接成功');
        return result.address;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          throw new Error('用户取消了连接请求');
        }
      }
      throw error;
    }
  };

  const updateWalletBalance = async (address: string) => {
    try {
      // 这里应该调用实际的余额查询API
      // 暂时使用模拟数据
      const mockBalance = (Math.random() * 1000).toFixed(2);
      updateBalance(mockBalance);
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  const disconnect = useCallback(() => {
    clearWalletInfo();
    toast.success('钱包已断开连接');
  }, [clearWalletInfo]);

  const refreshBalance = useCallback(async () => {
    if (address) {
      await updateWalletBalance(address);
    }
  }, [address]);

  // 监听钱包变化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== address) {
          setWalletInfo({
            address: accounts[0],
            walletType: 'metamask',
            chainId: walletType === 'metamask' ? '0x1' : 'cosmoshub-4',
            balance: '0'
          });
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address, walletType, disconnect, setWalletInfo]);

  return {
    address,
    isConnected,
    walletType,
    balance,
    connect,
    disconnect,
    refreshBalance
  };
};