import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Analytics,
  TrendingUp,
  Numbers,
  Timeline
} from '@mui/icons-material';
import { useLotteryStore } from '../store/lotteryStore';

const AnalysisPage: React.FC = () => {
  const { lotteryStats, betHistory } = useLotteryStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [analysisData, setAnalysisData] = useState<any>(null);

  // 生成分析数据
  useEffect(() => {
    const generateAnalysisData = () => {
      // 号码频率分析
      const numberFrequency: Record<number, number> = {};
      betHistory.forEach(bet => {
        bet.numbers.forEach(num => {
          numberFrequency[num] = (numberFrequency[num] || 0) + 1;
        });
      });

      // 转换为图表数据
      const frequencyData = Object.entries(numberFrequency)
        .map(([number, count]) => ({
          number: parseInt(number),
          count,
          percentage: ((count / betHistory.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // 显示前20个最常出现的号码

      // 中奖号码分布
      const winningNumbers = betHistory
        .filter(bet => bet.won)
        .map(bet => bet.numbers)
        .flat();
      
      const winningFrequency: Record<number, number> = {};
      winningNumbers.forEach(num => {
        winningFrequency[num] = (winningFrequency[num] || 0) + 1;
      });

      const winningData = Object.entries(winningFrequency)
        .map(([number, count]) => ({
          number: parseInt(number),
          count,
          percentage: ((count / winningNumbers.length) * 100).toFixed(1)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // 时间趋势数据
      const timeTrendData = betHistory
        .reduce((acc: any, bet) => {
          const date = new Date(bet.timestamp).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = { date, bets: 0, amount: 0, wins: 0 };
          }
          acc[date].bets += 1;
          acc[date].amount += parseFloat(bet.amount);
          if (bet.won) acc[date].wins += 1;
          return acc;
        }, {});

      const trendData = Object.values(timeTrendData)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // 最近30天

      // 号码范围分析
      const rangeData = [
        { range: '1-100', count: 0, color: '#8884d8' },
        { range: '101-200', count: 0, color: '#82ca9d' },
        { range: '201-300', count: 0, color: '#ffc658' },
        { range: '301-400', count: 0, color: '#ff7300' },
        { range: '401-500', count: 0, color: '#00ff00' },
        { range: '501-600', count: 0, color: '#ff00ff' },
        { range: '601-700', count: 0, color: '#00ffff' },
        { range: '701-800', count: 0, color: '#ffff00' },
        { range: '801-900', count: 0, color: '#ff0000' },
        { range: '901-999', count: 0, color: '#0000ff' }
      ];

      betHistory.forEach(bet => {
        bet.numbers.forEach(num => {
          const rangeIndex = Math.floor((num - 1) / 100);
          if (rangeIndex < rangeData.length) {
            rangeData[rangeIndex].count += 1;
          }
        });
      });

      setAnalysisData({
        frequencyData,
        winningData,
        trendData,
        rangeData,
        totalBets: betHistory.length,
        totalWinners: betHistory.filter(bet => bet.won).length,
        winRate: betHistory.length > 0 ? 
          (betHistory.filter(bet => bet.won).length / betHistory.length * 100).toFixed(1) : '0'
      });
    };

    generateAnalysisData();
  }, [betHistory, timeRange]);

  if (!analysisData) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="info">
          暂无数据进行分析
        </Alert>
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据分析
      </Typography>

      {/* 时间范围选择 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">分析时间范围:</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                label="时间范围"
              >
                <MenuItem value="7d">最近7天</MenuItem>
                <MenuItem value="30d">最近30天</MenuItem>
                <MenuItem value="90d">最近90天</MenuItem>
                <MenuItem value="all">全部时间</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Numbers color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{analysisData.totalBets}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    总投注次数
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{analysisData.totalWinners}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    中奖次数
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Timeline color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{analysisData.winRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    中奖率
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 号码频率分析 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最常投注号码 (前20名)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analysisData.frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="number" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value} 次 (${analysisData.frequencyData.find((d: any) => d.number === value)?.percentage}%)`,
                      '投注次数'
                    ]}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 号码范围分布 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                号码范围分布
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={analysisData.rangeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percentage }) => `${range}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analysisData.rangeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 中奖号码分析 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                中奖号码分布 (前10名)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analysisData.winningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="number" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value} 次`,
                      '中奖次数'
                    ]}
                  />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 投注趋势 */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                投注趋势 (最近30天)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analysisData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bets" 
                    stroke="#8884d8" 
                    name="投注次数"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wins" 
                    stroke="#82ca9d" 
                    name="中奖次数"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalysisPage;
