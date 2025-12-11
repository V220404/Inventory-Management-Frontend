import React, { useState, useEffect } from 'react';
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
  PointOfSale as POSIcon,
  ShoppingCart as ShoppingCartIcon,
  Storage as StorageIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  ArrowUpward as ArrowUpwardIcon,
  AttachMoney as MoneyIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  { text: 'Point of Sale', icon: <ShoppingCartIcon />, path: '/pos' },
  { text: 'Stock Management', icon: <StorageIcon />, path: '/stock' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

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

  useEffect(() => {
    calculateRevenue();
    // Recalculate when component mounts or when we might have new transactions
    const interval = setInterval(calculateRevenue, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const calculateRevenue = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Calculate daily revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = storedTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    });
    const daily = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    setDailyRevenue(daily);

    // Calculate monthly revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyTransactions = storedTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth;
    });
    const monthly = monthlyTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
    setMonthlyRevenue(monthly);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const drawer = (
    <Box 
      className="h-full flex flex-col"
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
          <Box className="flex items-center gap-3">
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
          {menuItems.map((item, index) => {
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
                <ListItem 
                  disablePadding 
                  sx={{ 
                    mb: 0,
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                      borderRadius: 3,
                      py: 1.75,
                      px: 3,
                      minHeight: 56,
                      transition: 'all 0.3s ease',
                      backgroundColor: isActive 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : 'transparent',
                      borderLeft: isActive 
                        ? '4px solid #2563eb' 
                        : '4px solid transparent',
                      boxShadow: isActive 
                        ? '0 4px 12px rgba(37, 99, 235, 0.15)' 
                        : 'none',
                      '&:hover': {
                        backgroundColor: isActive 
                          ? 'rgba(37, 99, 235, 0.15)' 
                          : 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 48,
                        color: isActive ? '#2563eb' : '#6b7280',
                        '& svg': {
                          fontSize: 26,
                        },
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

      {/* Logout Section */}
      <Box 
        sx={{ 
          p: 2.5,
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
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
                  '& .MuiListItemIcon-root': {
                    color: '#dc2626',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#dc2626',
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: '#6b7280',
                }}
              >
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
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Box className="flex h-screen">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
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
          
          {/* Revenue Display */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 2,
              flex: 1,
              ml: { sm: 2 }
            }}
          >
            {/* Daily Revenue */}
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
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  Daily
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#15803d',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  ${dailyRevenue.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Monthly Revenue */}
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
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  Monthly
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1d4ed8',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  ${monthlyRevenue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mobile Revenue Display */}
          {isSmallScreen && (
            <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
              <Chip
                icon={<TodayIcon sx={{ color: '#22c55e !important', fontSize: 16 }} />}
                label={`$${dailyRevenue.toFixed(0)}`}
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
              <Chip
                icon={<CalendarMonthIcon sx={{ color: '#3b82f6 !important', fontSize: 16 }} />}
                label={`$${monthlyRevenue.toFixed(0)}`}
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
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: '#6b7280' }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: '0.875rem' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <AccountIcon className="mr-2" />
                {user?.username}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon className="mr-2" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
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
              width: drawerWidth,
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
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

