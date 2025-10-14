import React from 'react'
import { Box, Typography, Link, Stack, Container } from '@mui/material'

export const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: 3, 
        color: 'text.secondary',
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} DD 3D 彩票. 保留所有权利.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link 
              href="https://github.com/LuckeeDAO" 
              target="_blank" 
              rel="noreferrer"
              underline="hover"
              color="inherit"
            >
              GitHub
            </Link>
            <Link 
              href="/docs" 
              underline="hover"
              color="inherit"
            >
              文档
            </Link>
            <Link 
              href="/help" 
              underline="hover"
              color="inherit"
            >
              帮助
            </Link>
          </Stack>
        </Stack>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            基于 CosmWasm 构建的去中心化彩票应用
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
