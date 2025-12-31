import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Storage as StorageIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  ArrowUpward as ArrowUpwardIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getRevenueStats } from '../../utils/api';
import { formatCurrency, formatCurrencyWhole } from '../../utils/currency';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Products', icon: <InventoryIcon />, path: '/dashboard/products' },
  { text: 'Point of Sale', icon: <ShoppingCartIcon />, path: '/dashboard/pos' },
  { text: 'Stock Management', icon: <StorageIcon />, path: '/dashboard/stock' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/dashboard/reports' },
];

// Reusable User Avatar Component
const UserAvatar = React.memo(({ user, size = 48 }) => {
  const isValidImage = user?.profileImage && 
    user.profileImage !== 'null' && 
    user.profileImage !== 'undefined';

  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
  }, []);

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: '#2563eb',
        fontSize: size === 36 ? '0.875rem' : '1.1rem',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      src={isValidImage ? user.profileImage : null}
      imgProps={{ onError: handleImageError }}
    >
      {!isValidImage && (user?.username?.charAt(0) || 'U').toUpperCase()}
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';

// Revenue Display Component
const RevenueDisplay = React.memo(({ dailyRevenue, monthlyRevenue, isSmallScreen }) => {
  const dailyChip = (
    <Chip
      icon={<TodayIcon sx={{ color: '#22c55e !important', fontSize: 16 }} />}
      label={formatCurrencyWhole(dailyRevenue)}
      size="small"
      sx={{
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#15803d',
        fontWeight: 700,
        fontSize: '0.7rem',
        height: 24,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );

  const monthlyChip = (
    <Chip
      icon={<CalendarMonthIcon sx={{ color: '#3b82f6 !important', fontSize: 16 }} />}
      label={formatCurrencyWhole(monthlyRevenue)}
      size="small"
      sx={{
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#1d4ed8',
        fontWeight: 700,
        fontSize: '0.7rem',
        height: 24,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );

  if (isSmallScreen) {
    return (
      <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
        {dailyChip}
        {monthlyChip}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, ml: { sm: 2 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: 2,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
        }}
      >
        <TodayIcon sx={{ color: '#22c55e', fontSize: 18 }} />
        <Box>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, display: 'block', lineHeight: 1 }}>
            Daily
          </Typography>
          <Typography variant="body2" sx={{ color: '#15803d', fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.2 }}>
            {formatCurrency(dailyRevenue)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: 2,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <CalendarMonthIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
        <Box>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, display: 'block', lineHeight: 1 }}>
            Monthly
          </Typography>
          <Typography variant="body2" sx={{ color: '#1d4ed8', fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.2 }}>
            {formatCurrency(monthlyRevenue)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

RevenueDisplay.displayName = 'RevenueDisplay';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();

  // Memoized revenue calculation
  const calculateRevenue = useCallback(async () => {
    try {
      if (!user?.username) return;
      
      const response = await getRevenueStats(user.username);
      if (response.success) {
        setDailyRevenue(response.data.dailyRevenue || 0);
        setMonthlyRevenue(response.data.monthlyRevenue || 0);
      } else {
        console.error('Failed to fetch revenue stats:', response.message);
        // Fallback to 0 if API fails
        setDailyRevenue(0);
        setMonthlyRevenue(0);
      }
    } catch (error) {
      console.error('Error calculating revenue:', error);
      // Fallback to 0 if API fails
      setDailyRevenue(0);
      setMonthlyRevenue(0);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      calculateRevenue();
      // Update revenue every 30 seconds
      const interval = setInterval(calculateRevenue, 30000);
      return () => clearInterval(interval);
    }
  }, [calculateRevenue, user?.username]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    handleMenuClose();
  }, [logout, navigate, handleMenuClose]);

  const handleResetPassword = useCallback(() => {
    navigate('/reset-password');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  const handleSettings = useCallback(() => {
    navigate('/settings');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  }, [navigate, isMobile]);

  // Memoized user display name
  const userDisplayName = useMemo(() => {
    if (!user) return 'User';
    return (user.firstName || user.lastName) 
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.username || 'User';
  }, [user]);

  // Drawer content
  const drawer = useMemo(() => (
    <Box 
      sx={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderRight: '1px solid #e5e7eb',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo Section */}
      <Box 
        sx={{ 
          p: 3.5,
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box 
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <ArrowUpwardIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em',
                }}
              >
                InvenTrack
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Inventory System
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Navigation Menu */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 3,
          py: 3,
          overflow: 'hidden',
        }}
      >
        <List 
          sx={{ 
            width: '100%', 
            py: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          {MENU_ITEMS.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItem disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 3,
                      py: 1.75,
                      px: 3,
                      minHeight: 56,
                      transition: 'all 0.3s ease',
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                      '&:hover': {
                        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 48,
                        color: isActive ? '#2563eb' : '#6b7280',
                        '& svg': { fontSize: 26 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.95rem',
                        color: isActive ? '#1e40af' : '#374151',
                        letterSpacing: '-0.01em',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box 
        sx={{ 
          p: 2.5,
          pt: 4,
          mt: 2,
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          flexShrink: 0,
        }}
      >
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                pb: 2,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <UserAvatar user={user} size={48} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#1f2937',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userDisplayName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  @{user?.username || 'username'}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Logout Button */}
        {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.25,
                px: 2,
                minHeight: 48,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  '& .MuiListItemIcon-root': { color: '#dc2626' },
                  '& .MuiListItemText-primary': { color: '#dc2626' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#6b7280' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#374151',
                }}
              />
            </ListItemButton>
          </ListItem>
        </motion.div> */} 
      </Box>
    </Box>
  ), [location.pathname, user, userDisplayName, handleNavigation, handleLogout]);

  return (
    <Box className="flex h-screen">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'white',
          color: '#1f2937',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 56, sm: 64 } 
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: '#6b7280' }}
          >
            <MenuIcon />
          </IconButton>
          
          <RevenueDisplay 
            dailyRevenue={dailyRevenue} 
            monthlyRevenue={monthlyRevenue} 
            isSmallScreen={isSmallScreen}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: '#6b7280' }}
            >
              <UserAvatar user={user} size={36} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 250,
                  borderRadius: 3,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }
              }}
            >
              <Box sx={{ p: 2, pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <UserAvatar user={user} size={48} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: '#1f2937',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {userDisplayName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      @{user?.username || 'username'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <MenuItem 
                onClick={handleSettings}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    '& .MuiSvgIcon-root': {
                      color: '#2563eb',
                    },
                    '& .MuiTypography-root': {
                      color: '#2563eb',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <AccountIcon sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <MenuItem 
                onClick={handleResetPassword}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    '& .MuiSvgIcon-root': {
                      color: '#2563eb',
                    },
                    '& .MuiTypography-root': {
                      color: '#2563eb',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <LockResetIcon sx={{ mr: 2, fontSize: 20 }} />
                Reset Password
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '& .MuiSvgIcon-root': {
                      color: '#dc2626',
                    },
                    '& .MuiTypography-root': {
                      color: '#dc2626',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              overflow: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: '#f9fafb',
          minHeight: '100vh',
        }}
        className="mt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children || <Outlet />}
        </motion.div>
      </Box>
    </Box>
  );
}
