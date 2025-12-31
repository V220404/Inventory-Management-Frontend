import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiRequest, { getRevenueStats, getAllSales } from '../utils/api';
import { formatCurrency } from '../utils/currency';
import SalesTrendsChart from '../components/BI/SalesTrendsChart';
import ProductPerformanceChart from '../components/BI/ProductPerformanceChart';
import ProfitLossChart from '../components/BI/ProfitLossChart';
import ForecastChart from '../components/BI/ForecastChart';
import LowStockAlerts from '../components/BI/LowStockAlerts';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch in parallel for better performance
      const [productsResponse, revenueResponse] = await Promise.all([
        apiRequest('/products'),
        getRevenueStats(),
      ]);

      // Check if responses are ok
      if (!productsResponse.ok) {
        throw new Error('Failed to load products');
      }
      if (!revenueResponse || !revenueResponse.success) {
        console.warn('Revenue stats may not be available');
      }

      const productsData = await productsResponse.json();
      const products = productsData.success
        ? productsData.data?.products || productsData.data || []
        : [];

      const todaySales = revenueResponse?.success
        ? revenueResponse.data?.dailyRevenue || 0
        : 0;

      // Calculate total stock
      const totalStock = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);

      // Find low stock items (threshold: 10)
      const lowStock = products.filter((p) => (parseInt(p.stock) || 0) < 10);

      setStats({
        totalProducts: products.length,
        totalStock: totalStock,
        todaySales: todaySales || 0,
        lowStockItems: lowStock.length,
      });
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon className="text-2xl" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Stock',
      value: stats.totalStock.toLocaleString(),
      icon: <TrendingUpIcon className="text-2xl" />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: <MoneyIcon className="text-2xl" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockItems === 0 ? '0 items' : `${stats.lowStockItems} items`,
      icon: <WarningIcon className="text-2xl" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <Box className="p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <Box className="mb-6" display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" className="font-bold mb-2 text-gray-800">
              Business Intelligence Dashboard
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Comprehensive insights into your inventory, sales, and business performance
            </Typography>
          </Box>
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            className="bg-blue-50 hover:bg-blue-100"
            title="Refresh data"
          >
            <RefreshIcon className={loading ? 'animate-spin' : ''} />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
            <Button size="small" onClick={handleRefresh} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Key Metrics Cards */}
        <Grid container spacing={3} className="mb-6">
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Box className="flex items-start justify-between mb-3">
                      <Box className={`${card.iconBg} p-2 rounded-lg`}>
                        <Box className={card.iconColor}>{card.icon}</Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    {loading && !dataLoaded ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} />
                        <Typography variant="h5" className="font-bold text-gray-400">
                          Loading...
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h5" className="font-bold text-gray-800">
                        {card.value}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Business Intelligence Charts Section */}
        {dataLoaded && (
          <Box className="mb-6">
            <Typography variant="h5" className="font-bold mb-4 text-gray-800">
              Analytics & Insights
            </Typography>

            {/* Show message if no data available */}
            {stats.totalProducts === 0 && stats.todaySales === 0 ? (
              <Alert severity="info" className="mb-4">
                <Typography variant="body1" className="mb-2">
                  <strong>Getting Started:</strong>
                </Typography>
                <Typography variant="body2">
                  • Add products in the <strong>Products</strong> page to see inventory metrics
                  <br />
                  • Make sales in the <strong>Point of Sale</strong> page to see revenue analytics
                  <br />
                  • Charts and insights will appear as you add data
                </Typography>
              </Alert>
            ) : (
              <>
                {/* Sales Trends and Product Performance Row */}
                <Grid container spacing={3} className="mb-6">
                  <Grid item xs={12} lg={8}>
                    <SalesTrendsChart />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <LowStockAlerts />
                  </Grid>
                </Grid>

                {/* Product Performance and Revenue Analysis Row */}
                <Grid container spacing={3} className="mb-6">
                  <Grid item xs={12} lg={6}>
                    <ProductPerformanceChart />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <ProfitLossChart />
                  </Grid>
                </Grid>

                {/* Forecasting Row */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <ForecastChart />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}

        {/* Loading State for Charts */}
        {loading && !dataLoaded && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Box textAlign="center">
              <CircularProgress size={60} />
              <Typography variant="h6" className="mt-4 text-gray-600">
                Loading dashboard data...
              </Typography>
            </Box>
          </Box>
        )}
      </motion.div>
    </Box>
  );
}
