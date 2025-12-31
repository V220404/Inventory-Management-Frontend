import React, { useState, useEffect, memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getProductPerformance } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const ProductPerformanceChart = memo(function ProductPerformanceChart() {
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductPerformance(10);
      if (response && response.success) {
        setTopProducts(response.data?.topProducts || []);
        setCategoryData(response.data?.categoryPerformance || []);
      } else {
        const errorMsg = response?.message || 'Failed to load product performance';
        if (errorMsg.includes('Route not found')) {
          setError('BI endpoint not available. Please check backend deployment.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error loading product performance:', error);
      setError('Failed to load product performance. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg rounded-xl border border-gray-100">
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box className="bg-blue-100 p-2 rounded-lg">
              <InventoryIcon className="text-blue-600" />
            </Box>
            <Box>
              <Typography variant="h6" className="font-bold text-gray-800">
                Product Performance
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Top performing products by revenue
              </Typography>
            </Box>
          </Box>

          {error ? (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          ) : null}

          {topProducts.length === 0 && !loading ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" className="text-gray-500">
                No sales data available. Make some sales to see product performance.
              </Typography>
            </Box>
          ) : topProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topProducts.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                    formatter={(value, name) => {
                      if (name === 'totalRevenue') return [formatCurrency(value, false), 'Revenue'];
                      if (name === 'totalQuantity') return [value, 'Quantity Sold'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    name="Revenue"
                  />
                  <Bar
                    dataKey="totalQuantity"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    name="Quantity Sold"
                  />
                </BarChart>
              </ResponsiveContainer>

              <Box mt={3}>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Top Products Summary
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {topProducts.slice(0, 5).map((product, index) => (
                    <Chip
                      key={product.productId}
                      label={`${product.name}: ${formatCurrency(product.totalRevenue)}`}
                      size="small"
                      className="bg-blue-50 text-blue-700"
                    />
                  ))}
                </Box>
              </Box>
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default ProductPerformanceChart;

