import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Toolbar
} from '@mui/material'
import { 
  Home, 
  Casino, 
  Visibility, 
  EmojiEvents, 
  History,
  Analytics
} from '@mui/icons-material'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const navigation = [
    { name: '首页', href: '/', icon: <Home /> },
    { name: '投注', href: '/bet', icon: <Casino /> },
    { name: '揭秘', href: '/reveal', icon: <Visibility /> },
    { name: '结果', href: '/result', icon: <EmojiEvents /> },
    { name: '历史', href: '/history', icon: <History /> },
    { name: '分析', href: '/analysis', icon: <Analytics /> },
  ]

  const handleMenuClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const drawerContent = (
    <Box sx={{ width: 250, height: '100%' }}>
      <Toolbar />
      <List>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                selected={isActive}
                onClick={handleMenuClick}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '20',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '30',
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // 更好的移动端性能
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          position: 'relative',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
