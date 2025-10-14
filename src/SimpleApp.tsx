import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Typography, Box } from '@mui/material'

// 创建MUI主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

const SimpleHomePage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box py={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          DD 3D 彩票系统
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          去中心化3D彩票游戏平台
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          基于CosmWasm智能合约的公平、透明、安全的彩票游戏。
        </Typography>
      </Box>
    </Container>
  )
}

function SimpleApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="*" element={<SimpleHomePage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default SimpleApp
