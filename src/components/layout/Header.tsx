import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Home, 
  Casino, 
  Visibility, 
  EmojiEvents, 
  History, 
  Analytics,
  Menu as MenuIcon
} from '@mui/icons-material'
// import { useLotteryStore } from '../../store/lotteryStore'
import WalletStatus from '../WalletStatus'

interface HeaderProps {
  onMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  // const { openWalletModal } = useLotteryStore()

  const navItems = [
    { path: '/', label: '首页', icon: <Home /> },
    { path: '/bet', label: '投注', icon: <Casino /> },
    { path: '/reveal', label: '揭秘', icon: <Visibility /> },
    { path: '/result', label: '结果', icon: <EmojiEvents /> },
    { path: '/history', label: '历史', icon: <History /> },
    { path: '/analysis', label: '分析', icon: <Analytics /> },
  ]

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="打开菜单"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          component={Link} 
          to="/" 
          sx={{ 
            mr: 4, 
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: { xs: 1, sm: 0 }
          }}
        >
          {isMobile ? 'DD 3D 彩票' : 'DD 3D 彩票系统'}
        </Typography>

        {/* 桌面端导航 */}
        <Box sx={{ 
          flexGrow: 1, 
          display: { xs: 'none', md: 'flex' }, 
          gap: 1,
          ml: 2
        }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              color="inherit"
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
                minWidth: 'auto',
                px: 2
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* 钱包状态 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WalletStatus />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
