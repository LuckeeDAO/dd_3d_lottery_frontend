import { useTheme, useMediaQuery } from '@mui/material'

export const useResponsive = () => {
  const theme = useTheme()
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'))
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isSmallScreen: isMobile,
    isMediumScreen: isTablet,
    isWideScreen: isLargeScreen,
  }
}
