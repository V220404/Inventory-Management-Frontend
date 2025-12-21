import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiRequest, { getRevenueStats, getAllSales } from '../utils/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    todaySales: 0,
    lowStockItems: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsResponse = await apiRequest('/products');
      const productsData = await productsResponse.json();
      const products = productsData.success ? (productsData.data?.products || productsData.data || []) : [];

      // Fetch revenue stats for today's sales
      const revenueResponse = await getRevenueStats();
      const todaySales = revenueResponse.success ? (revenueResponse.data?.dailyRevenue || 0) : 0;

      // Fetch recent sales
      const salesResponse = await getAllSales(1, 10);
      const recentSales = salesResponse.success ? (salesResponse.data?.sales || []) : [];

      // Calculate total stock
      const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
      
      // Find low stock items
      const lowStock = products.filter(p => (p.stock || 0) < 10);
      
      setStats({
        totalProducts: products.length,
        totalStock: totalStock,
        todaySales: todaySales,
        lowStockItems: lowStock.length,
      });

      setLowStockAlerts(lowStock.slice(0, 5));
      
      // Format recent transactions for display
      const formattedTransactions = recentSales.flatMap(sale => {
        return sale.items?.map(item => ({
          ...item,
          transactionId: sale.id,
          date: sale.date,
          transactionTotal: sale.total,
        })) || [];
      });
      
      setRecentTransactions(formattedTransactions.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate trend percentages (mock data - replace with actual calculations)
  const trends = {
    totalProducts: 12,
    totalStock: 8,
    todaySales: 23,
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon className="text-2xl" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: trends.totalProducts,
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: <TrendingUpIcon className="text-2xl" />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: trends.totalStock,
    },
    {
      title: "Today's Sales",
      value: `$${stats.todaySales.toFixed(2)}`,
      icon: <MoneyIcon className="text-2xl" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: trends.todaySales,
    },
    {
      title: 'Low Stock Alert',
      value: lowStockAlerts.length === 0 ? '0 items' : `${lowStockAlerts.length} items`,
      icon: <WarningIcon className="text-2xl" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: null,
    },
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <Box className="mb-6">
          <Typography variant="h4" className="font-bold mb-2 text-gray-800">
            Dashboard
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Welcome back! Here's what's happening with your inventory.
          </Typography>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} className="mb-6">
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Box className="flex items-start justify-between mb-3">
                      <Box className={`${card.iconBg} p-2 rounded-lg`}>
                        <Box className={card.iconColor}>
                          {card.icon}
                        </Box>
                      </Box>
                      {card.trend !== null && (
                        <Chip
                          label={`↑ ${card.trend}%`}
                          size="small"
                          className="bg-green-50 text-green-600 text-xs font-semibold"
                          sx={{
                            height: '24px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Panels */}
        <Grid container spacing={3}>
          {/* Recent Transactions */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card className="shadow-md rounded-lg border border-gray-100">
                <CardContent className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                    Recent Transactions
                  </Typography>
                  {recentTransactions.length === 0 ? (
                    <Box className="text-center py-8">
                      <Typography variant="body2" className="text-gray-500">
                        No recent transactions
                      </Typography>
                    </Box>
                  ) : (
                    <List className="p-0">
                      {recentTransactions.map((item, index) => (
                        <motion.div
                          key={`${item.transactionId}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ListItem className="px-0 py-2">
                            <ListItemText
                              primary={
                                <Box className="flex justify-between items-start">
                                  <Typography variant="body1" className="font-medium text-gray-800">
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" className="text-gray-500 ml-4">
                                    {formatTime(item.date)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box className="mt-1">
                                  <Typography variant="body2" className="text-gray-600">
                                    Quantity: {item.quantity} x ${item.price.toFixed(2)}
                                  </Typography>
                                  <Typography variant="body2" className="font-semibold text-gray-800 mt-0.5">
                                    Total: ${(item.quantity * item.price).toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < recentTransactions.length - 1 && <Divider />}
                        </motion.div>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Low Stock Products */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card className="shadow-md rounded-lg border border-gray-100">
                <CardContent className="p-4">
                  <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                    Low Stock Products
                  </Typography>
                  {lowStockAlerts.length === 0 ? (
                    <Box className="text-center py-8">
                      <Box className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                        <CheckCircleIcon className="text-green-600 text-3xl" />
                      </Box>
                      <Typography variant="body1" className="text-gray-800 font-medium">
                        All products well stocked
                      </Typography>
                    </Box>
                  ) : (
                    <List className="p-0">
                      {lowStockAlerts.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem className="px-0 py-2">
                            <ListItemText
                              primary={item.name}
                              secondary={`Stock: ${item.stock} units`}
                            />
                            <Chip
                              label="Low Stock"
                              size="small"
                              color="warning"
                              sx={{ ml: 2 }}
                            />
                          </ListItem>
                          {index < lowStockAlerts.length - 1 && <Divider />}
                        </motion.div>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
