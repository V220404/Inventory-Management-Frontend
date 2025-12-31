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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
} from 'recharts';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getProfitLoss } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const ProfitLossChart = memo(function ProfitLossChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfitLoss(period);
      if (response && response.success) {
        const products = response.data?.products || [];
        setData(products.slice(0, 10)); // Top 10 products
        setTotalRevenue(response.data?.totalRevenue || 0);
      } else {
        const errorMsg = response?.message || 'Failed to load revenue data';
        if (errorMsg.includes('Route not found')) {
          setError('BI endpoint not available. Please check backend deployment.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error loading profit & loss data:', error);
      setError('Failed to load revenue data. Please check your connection and try again.');
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box className="bg-green-100 p-2 rounded-lg">
                <MoneyIcon className="text-green-600" />
              </Box>
              <Box>
                <Typography variant="h6" className="font-bold text-gray-800">
                  Revenue Analysis
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Product revenue breakdown
                </Typography>
              </Box>
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

          <Box className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
            <Typography variant="body2" className="text-gray-600 mb-1">
              Total Revenue ({period} days)
            </Typography>
            <Typography variant="h4" className="font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </Typography>
          </Box>

          {error ? (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          ) : null}

          {data.length === 0 && !loading ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" className="text-gray-500">
                No revenue data available for the selected period
              </Typography>
            </Box>
          ) : data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#666"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => formatCurrency(value, false)}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>

              <TableContainer component={Paper} className="mt-4" elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">Product</TableCell>
                      <TableCell align="right" className="font-semibold">
                        Revenue
                      </TableCell>
                      <TableCell align="right" className="font-semibold">
                        Quantity
                      </TableCell>
                      <TableCell align="right" className="font-semibold">
                        Avg Price
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 5).map((product) => (
                      <TableRow key={product.productId} hover>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right" className="font-medium text-green-600">
                          {formatCurrency(product.revenue)}
                        </TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(product.avgPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default ProfitLossChart;

