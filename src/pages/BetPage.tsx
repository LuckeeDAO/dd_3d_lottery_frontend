import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import { Casino, AttachMoney } from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';
import { useLotteryStore } from '../store/lotteryStore';
import toast from 'react-hot-toast';

const BetPage: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { currentRound, addBetRecord, setCurrentRound } = useLotteryStore();
  
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<string>('1');
  const [autoReveal, setAutoReveal] = useState<boolean>(true);
  // const [quickPick] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [randomSeed, setRandomSeed] = useState<string>('0');
  const [numberMultipliers, setNumberMultipliers] = useState<{[key: number]: number}>({});

  // 生成随机号码（根据投注金额生成对应数量的号码）
  const generateRandomNumbers = () => {
    const amount = parseInt(betAmount) || 1;
    const maxNumbers = Math.min(amount, 1000); // 限制最大1000个号码
    const numbers = [];
    
    for (let i = 0; i < maxNumbers; i++) {
      const num = Math.floor(Math.random() * 1000); // 0-999
      numbers.push(num);
    }
    return numbers.sort((a, b) => a - b);
  };

  // 生成随机种子（0-999之间的数字）
  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 1000).toString();
    setRandomSeed(seed);
    return seed;
  };

  // 快速选号
  const handleQuickPick = () => {
    const numbers = generateRandomNumbers();
    setSelectedNumbers(numbers);
    // setQuickPick(true);
    // 注意：快速选号不自动生成随机种子，让用户自己决定
  };

  // 手动选择号码（支持多号码选择，每个号码可设置不同倍数）
  const handleNumberSelect = useCallback((number: number) => {
    if (selectedNumbers.includes(number)) {
      // 如果号码已选择，则增加倍数
      const currentMultiplier = numberMultipliers[number] || 1;
      const newMultiplier = currentMultiplier + 1;
      
      if (newMultiplier > 1000) {
        toast.error('单个号码倍数不能超过1000');
        return;
      }
      
      // 直接计算新的总金额，避免setTimeout延迟
      const newMultipliers = { ...numberMultipliers, [number]: newMultiplier };
      const newTotal = selectedNumbers.reduce((total, num) => {
        return total + (newMultipliers[num] || 1);
      }, 0);
      
      setNumberMultipliers(newMultipliers);
      setBetAmount(newTotal.toString());
    } else {
      // 如果号码未选择，则添加新号码
      const newSelectedNumbers = [...selectedNumbers, number].sort((a, b) => a - b);
      const newMultipliers = { ...numberMultipliers, [number]: 1 };
      const newTotal = newSelectedNumbers.reduce((total, num) => {
        return total + (newMultipliers[num] || 1);
      }, 0);
      
      setSelectedNumbers(newSelectedNumbers);
      setNumberMultipliers(newMultipliers);
      setBetAmount(newTotal.toString());
    }
  }, [selectedNumbers, numberMultipliers]);

  // 设置号码倍数
  const handleMultiplierChange = useCallback((number: number, multiplier: number) => {
    if (multiplier < 1 || multiplier > 1000) {
      toast.error('倍数必须在1-1000之间');
      return;
    }
    
    // 直接计算新的总金额，避免setTimeout延迟
    const newMultipliers = { ...numberMultipliers, [number]: multiplier };
    const newTotal = selectedNumbers.reduce((total, num) => {
      return total + (newMultipliers[num] || 1);
    }, 0);
    
    setNumberMultipliers(newMultipliers);
    setBetAmount(newTotal.toString());
  }, [selectedNumbers, numberMultipliers]);

  // 计算总投注金额（考虑倍数）- 使用useMemo缓存
  const calculateTotalBetAmount = useMemo(() => {
    return selectedNumbers.reduce((total, number) => {
      const multiplier = numberMultipliers[number] || 1;
      return total + multiplier;
    }, 0);
  }, [selectedNumbers, numberMultipliers]);

  // 提交投注
  const handleSubmitBet = async () => {
    if (!isConnected) {
      toast.error('请先连接钱包');
      return;
    }

    // 验证随机种子格式
    const seedNum = parseInt(randomSeed);
    if (isNaN(seedNum) || seedNum < 0 || seedNum > 999) {
      toast.error('随机种子必须是0-999之间的数字');
      return;
    }

    const totalBetAmount = calculateTotalBetAmount;
    if (totalBetAmount === 0) {
      toast.error('请至少选择一个幸运数字');
      return;
    }

    if (!betAmount || parseFloat(betAmount) < 1 || parseFloat(betAmount) > 1000000) {
      toast.error('投注金额必须在1-1000000 LUCKEE之间');
      return;
    }

    setIsSubmitting(true);
    try {
      // 这里应该调用实际的智能合约
      // 暂时使用模拟数据
      const betRecord = {
        id: `bet_${Date.now()}`,
        roundId: currentRound?.id || 'current',
        player: address!,
        numbers: selectedNumbers,
        multipliers: numberMultipliers,
        randomSeed: randomSeed,
        amount: betAmount,
        totalAmount: totalBetAmount,
        timestamp: Date.now(),
        revealed: false,
        won: false
      };

      addBetRecord(betRecord);
      
      // 更新当前轮次信息
      if (currentRound) {
        setCurrentRound({
          ...currentRound,
          totalBets: currentRound.totalBets + 1,
          totalAmount: (parseFloat(currentRound.totalAmount) + parseFloat(betAmount)).toString()
        });
      }

      toast.success('投注成功！');
      
      // 重置表单
      setSelectedNumbers([]);
      setBetAmount('1');
      // setQuickPick(false);
      setRandomSeed('0');
      setNumberMultipliers({});
    } catch (error) {
      console.error('投注失败:', error);
      toast.error('投注失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 号码选择网格 - 使用useMemo优化渲染
  const NumberGrid = useMemo(() => {
    const numbers = Array.from({ length: 999 }, (_, i) => i + 1);
    
    return (
      <Grid container spacing={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
        {numbers.map((number) => {
          const isSelected = selectedNumbers.includes(number);
          const multiplier = numberMultipliers[number] || 0;
          
          return (
            <Grid item xs={1.2} sm={1} key={number}>
              <Chip
                label={isSelected ? `${number} (×${multiplier})` : number}
                onClick={() => handleNumberSelect(number)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                size="small"
                sx={{ 
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: isSelected ? '0.7rem' : '0.75rem',
                  '&:hover': {
                    backgroundColor: isSelected ? 'primary.dark' : 'action.hover'
                  }
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [selectedNumbers, numberMultipliers, handleNumberSelect]);

  // 号码选择网格组件
  const NumberGridComponent = useCallback(() => NumberGrid, [NumberGrid]);

  if (!isConnected) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          请先连接钱包才能进行投注
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
        投注彩票
      </Typography>

      <Grid container spacing={3}>
        {/* 左侧：号码选择 */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  选择幸运数字 (已选择 {selectedNumbers.length} 个)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  点击数字选择，再次点击增加倍数。投注金额将根据选择的倍数自动计算。
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={handleQuickPick}
                    startIcon={<Casino />}
                    sx={{ mr: 1 }}
                  >
                    快速选号
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedNumbers([])}
                    disabled={selectedNumbers.length === 0}
                  >
                    清空
                  </Button>
                </Box>
              </Box>

              {selectedNumbers.length > 0 && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    已选择的号码及倍数:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedNumbers.map((number) => (
                      <Box key={number} display="flex" alignItems="center" gap={1} mb={1}>
                        <Chip
                          label={`${number} (×${numberMultipliers[number] || 1})`}
                          color="primary"
                          onDelete={() => {
                            setSelectedNumbers(selectedNumbers.filter(n => n !== number));
                            const newMultipliers = { ...numberMultipliers };
                            delete newMultipliers[number];
                            setNumberMultipliers(newMultipliers);
                          }}
                        />
                        <TextField
                          size="small"
                          type="number"
                          value={numberMultipliers[number] || 1}
                          onChange={(e) => handleMultiplierChange(number, parseInt(e.target.value) || 1)}
                          inputProps={{ min: 1, max: 1000, style: { width: '60px' } }}
                          sx={{ width: '80px' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <NumberGridComponent />
            </CardContent>
          </Card>
        </Grid>

        {/* 右侧：投注设置 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                投注设置
              </Typography>

              <Box mb={3}>
                <TextField
                  label="投注金额 (LUCKEE)"
                  type="number"
                  value={betAmount}
                  fullWidth
                  inputProps={{ readOnly: true }}
                  helperText="投注金额根据选择的幸运数字倍数自动计算"
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ mr: 1 }} />
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  label="随机种子"
                  value={randomSeed}
                  onChange={(e) => setRandomSeed(e.target.value)}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0, max: 999 }}
                  placeholder="请输入0-999之间的数字"
                  helperText="随机种子直接决定最终中奖幸运数字。必须是0-999之间的数字"
                  InputProps={{
                    endAdornment: (
                      <Button 
                        size="small" 
                        onClick={generateRandomSeed}
                        sx={{ ml: 1 }}
                        variant="outlined"
                      >
                        随机生成
                      </Button>
                    )
                  }}
                />
                <Box display="flex" gap={1} mt={1}>
                  <Button 
                    size="small" 
                    onClick={() => setRandomSeed('0')}
                    variant="outlined"
                    color="secondary"
                  >
                    重置为0
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => setRandomSeed('999')}
                    variant="outlined"
                    color="primary"
                  >
                    设置为999
                  </Button>
                </Box>
              </Box>

              <Box mb={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoReveal}
                      onChange={(e) => setAutoReveal(e.target.checked)}
                    />
                  }
                  label="自动开奖"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  投注后自动进入开奖阶段
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  投注摘要
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography>选择号码:</Typography>
                  <Typography>{selectedNumbers.length} 个不同数字</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>总投注金额:</Typography>
                  <Typography fontWeight="bold" color="primary">
                    {calculateTotalBetAmount} LUCKEE
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>随机种子:</Typography>
                  <Typography variant="caption" sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {randomSeed}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmitBet}
                disabled={selectedNumbers.length === 0 || isSubmitting}
                startIcon={<Casino />}
              >
                {isSubmitting ? '提交中...' : '确认投注'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BetPage;
