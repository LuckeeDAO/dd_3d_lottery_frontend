import React, { useState } from 'react'
import { Box, Container } from '@mui/material'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import WalletStatus from '../WalletStatus'
import BlockchainStatus from '../BlockchainStatus'
import LotteryPhase from '../LotteryPhase'
// import { useResponsive } from '../../hooks/useResponsive'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const { isMobile } = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuToggle={handleMenuToggle} />
      
      {/* 状态栏 */}
      <Box sx={{ 
        bgcolor: 'grey.50', 
        borderBottom: 1, 
        borderColor: 'divider',
        py: 1,
        mt: '64px' // 为固定头部留出空间
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <WalletStatus />
            <BlockchainStatus />
          </Box>
        </Container>
      </Box>

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - 250px)` },
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default'
          }}
        >
          {/* 彩票阶段显示 */}
          <Box sx={{ mb: 3 }}>
            <LotteryPhase />
          </Box>
          
          {children}
        </Box>
      </Box>
      
      <Footer />
    </Box>
  )
}
