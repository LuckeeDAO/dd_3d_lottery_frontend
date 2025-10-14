// import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/Home/HomePage'
import BetPage from '@/pages/BetPage'
import { RevealPage } from '@/pages/Reveal/RevealPage'
import { ResultPage } from '@/pages/Result/ResultPage'
import HistoryPage from '@/pages/HistoryPage'
import AnalysisPage from '@/pages/AnalysisPage'
import WalletConnectModal from '@/components/WalletConnectModal'

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bet" element={<BetPage />} />
          <Route path="/reveal" element={<RevealPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Layout>
      <WalletConnectModal />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </ThemeProvider>
  )
}

export default App
