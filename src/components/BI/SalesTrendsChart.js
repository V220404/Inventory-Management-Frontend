import React, { useState, useEffect, memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getSalesTrends } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const SalesTrendsChart = memo(function SalesTrendsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSalesTrends(period);
      if (response && response.success) {
        setData(response.data?.daily || []);
        setWeeklyRevenue(response.data?.weeklyRevenue || 0);
        setMonthlyRevenue(response.data?.monthlyRevenue || 0);
      } else {
        const errorMsg = response?.message || 'Failed to load sales trends';
        if (errorMsg.includes('Route not found')) {
          setError('BI endpoint not available. Please check backend deployment.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error loading sales trends:', error);
      setError('Failed to load sales trends. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                Sales Trends
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Revenue and transaction trends over time
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={14}>Last 14 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={60}>Last 60 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" gap={2} mb={3}>
            <Box className="bg-blue-50 p-3 rounded-lg flex-1">
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUpIcon className="text-blue-600" fontSize="small" />
                <Typography variant="body2" className="text-gray-600">
                  Weekly Revenue
                </Typography>
              </Box>
              <Typography variant="h6" className="font-bold text-blue-600">
                {formatCurrency(weeklyRevenue)}
              </Typography>
            </Box>
            <Box className="bg-purple-50 p-3 rounded-lg flex-1">
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUpIcon className="text-purple-600" fontSize="small" />
                <Typography variant="body2" className="text-gray-600">
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h6" className="font-bold text-purple-600">
                {formatCurrency(monthlyRevenue)}
              </Typography>
            </Box>
          </Box>

          {error ? (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          ) : null}

          {data.length === 0 && !loading ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" className="text-gray-500">
                No sales data available for the selected period
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
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
                  if (name === 'revenue') return [formatCurrency(value, false), 'Revenue'];
                  return [value, 'Transactions'];
                }}
                labelFormatter={(label) => formatDate(label)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
                activeDot={{ r: 5 }}
                name="Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SalesTrendsChart;

