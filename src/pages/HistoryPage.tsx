import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  Grid,
  Alert
} from '@mui/material';
import {
  History,
  Search,
  Visibility,
  EmojiEvents,
  AttachMoney,
  FilterList
} from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';
import { useLotteryStore } from '../store/lotteryStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const HistoryPage: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { betHistory, lotteryStats } = useLotteryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'won' | 'lost' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 过滤投注记录
  const filteredBets = betHistory
    .filter(bet => {
      const matchesSearch = searchTerm === '' || 
        bet.id.includes(searchTerm) || 
        bet.numbers.some(n => n.toString().includes(searchTerm));
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'won' && bet.won) ||
        (filterStatus === 'lost' && !bet.won && bet.revealed) ||
        (filterStatus === 'pending' && !bet.revealed);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  // 分页
  const totalPages = Math.ceil(filteredBets.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBets = filteredBets.slice(startIndex, startIndex + pageSize);

  // 统计信息
  const totalBets = betHistory.length;
  const wonBets = betHistory.filter(bet => bet.won).length;
  const totalWinnings = betHistory
    .filter(bet => bet.won && bet.reward)
    .reduce((sum, bet) => sum + parseFloat(bet.reward || '0'), 0);
  const winRate = totalBets > 0 ? (wonBets / totalBets * 100).toFixed(1) : '0';

  const getStatusChip = (bet: any) => {
    if (!bet.revealed) {
      return <Chip label="待开奖" color="warning" size="small" />;
    } else if (bet.won) {
      return <Chip label="中奖" color="success" size="small" />;
    } else {
      return <Chip label="未中奖" color="default" size="small" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
  };

  if (!isConnected) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="warning">
          请先连接钱包查看投注历史
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <History sx={{ mr: 1, verticalAlign: 'middle' }} />
        投注历史
      </Typography>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FilterList color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{totalBets}</Typography>
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
                <EmojiEvents color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{wonBets}</Typography>
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
                <AttachMoney color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{totalWinnings.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    总奖金 (LUCKEE)
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
                <Visibility color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{winRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    中奖率
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 搜索和过滤 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="搜索投注记录..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="状态过滤"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                SelectProps={{ native: true }}
              >
                <option value="all">全部</option>
                <option value="won">中奖</option>
                <option value="lost">未中奖</option>
                <option value="pending">待开奖</option>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 投注记录表格 */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>投注ID</TableCell>
                <TableCell>投注号码</TableCell>
                <TableCell>投注金额</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>奖金</TableCell>
                <TableCell>投注时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      暂无投注记录
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {bet.id.slice(-8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        {bet.numbers.map((number, index) => (
                          <Chip
                            key={index}
                            label={number}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {bet.amount} LUCKEE
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(bet)}
                    </TableCell>
                    <TableCell>
                      {bet.reward ? (
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          +{bet.reward} LUCKEE
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(bet.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="查看详情">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 分页 */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default HistoryPage;
