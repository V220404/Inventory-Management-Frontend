import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    processData();
  }, [transactions, products, timeRange]);

  const loadData = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setTransactions(storedTransactions);
    setProducts(storedProducts);
  };

  const processData = () => {
    const now = new Date();
    let filteredTransactions = [...transactions];

    // Filter by time range
    if (timeRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactions.filter(
        (t) => new Date(t.date) >= sevenDaysAgo
      );
    } else if (timeRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactions.filter(
        (t) => new Date(t.date) >= thirtyDaysAgo
      );
    } else if (timeRange === 'year') {
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactions.filter(
        (t) => new Date(t.date) >= oneYearAgo
      );
    }

    // Calculate sales trends
    const salesByDate = {};
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = { date, sales: 0, revenue: 0 };
      }
      salesByDate[date].sales += transaction.items?.length || 0;
      salesByDate[date].revenue += transaction.total || 0;
    });

    const sortedSalesData = Object.values(salesByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        date: item.date,
        Sales: item.sales,
        Revenue: item.revenue,
      }));

    setSalesData(sortedSalesData);

    // Calculate top products
    const productSales = {};
    filteredTransactions.forEach((transaction) => {
      transaction.items?.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    const sortedTopProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setTopProducts(sortedTopProducts);

    // Revenue trend data
    const revenueByDate = {};
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += transaction.total || 0;
    });

    const sortedRevenueData = Object.entries(revenueByDate)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, revenue]) => ({ date, revenue: revenue.toFixed(2) }));

    setRevenueData(sortedRevenueData);
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalSales = transactions.length;
  const totalItemsSold = transactions.reduce(
    (sum, t) => sum + (t.items?.length || 0),
    0
  );
  const averageTransactionValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  const pieData = topProducts.map((product) => ({
    name: product.name,
    value: product.quantity,
  }));

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Reports & Analytics
          </Typography>
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Total Revenue
                      </Typography>
                      <Typography variant="h5" className="font-bold text-green-600">
                        ${totalRevenue.toFixed(2)}
                      </Typography>
                    </Box>
                    <MoneyIcon className="text-4xl text-green-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Total Sales
                      </Typography>
                      <Typography variant="h5" className="font-bold text-blue-600">
                        {totalSales}
                      </Typography>
                    </Box>
                    <CartIcon className="text-4xl text-blue-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Items Sold
                      </Typography>
                      <Typography variant="h5" className="font-bold text-purple-600">
                        {totalItemsSold}
                      </Typography>
                    </Box>
                    <InventoryIcon className="text-4xl text-purple-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Avg. Transaction
                      </Typography>
                      <Typography variant="h5" className="font-bold text-orange-600">
                        ${averageTransactionValue.toFixed(2)}
                      </Typography>
                    </Box>
                    <TrendingUpIcon className="text-4xl text-orange-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Sales Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Sales"
                      stroke="#2196f3"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#4caf50"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Top Products
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Revenue by Date
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Top Selling Products
                </Typography>
                <Box className="space-y-3">
                  {topProducts.length === 0 ? (
                    <Typography variant="body2" className="text-gray-500 text-center py-8">
                      No sales data available
                    </Typography>
                  ) : (
                    topProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Paper className="p-3 hover:shadow-md transition-shadow">
                          <Box className="flex justify-between items-center">
                            <Box>
                              <Typography variant="body1" className="font-semibold">
                                {index + 1}. {product.name}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                Quantity: {product.quantity} • Revenue: $
                                {product.revenue.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

