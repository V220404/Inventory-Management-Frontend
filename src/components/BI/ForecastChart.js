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
import { getForecast } from '../../utils/api';

const ForecastChart = memo(function ForecastChart() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForecast();
      if (response && response.success) {
        setForecasts(response.data?.forecasts || []);
      } else {
        const errorMsg = response?.message || 'Failed to load forecast data';
        if (errorMsg.includes('Route not found')) {
          setError('BI endpoint not available. Please check backend deployment.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error loading forecast data:', error);
      setError('Failed to load forecast data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for top 5 products
  const chartData = forecasts.slice(0, 5).map((forecast) => {
    const data = forecast.forecast.map((f) => ({
      date: f.date,
      [`${forecast.name}`]: f.forecastedQuantity,
    }));
    return { forecast, data };
  });

  // Combine forecast data for chart
  const combinedData = [];
  if (forecasts.length > 0 && forecasts[0].forecast) {
    forecasts[0].forecast.forEach((_, index) => {
      const entry = { date: forecasts[0].forecast[index].date };
      forecasts.slice(0, 5).forEach((forecast) => {
        entry[forecast.name] = forecast.forecast[index]?.forecastedQuantity || 0;
      });
      combinedData.push(entry);
    });
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box className="bg-purple-100 p-2 rounded-lg">
              <TrendingUpIcon className="text-purple-600" />
            </Box>
            <Box>
              <Typography variant="h6" className="font-bold text-gray-800">
                Demand Forecasting
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                7-day sales forecast based on historical data
              </Typography>
            </Box>
          </Box>

          {error ? (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          ) : null}

          {forecasts.length === 0 && !loading ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" className="text-gray-500">
                No forecast data available. Need at least 30 days of sales history.
              </Typography>
            </Box>
          ) : forecasts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  {forecasts.slice(0, 5).map((forecast, index) => (
                    <Line
                      key={forecast.productId}
                      type="monotone"
                      dataKey={forecast.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name={forecast.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              <Box mt={3}>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Forecast Summary (Next 7 Days)
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {forecasts.slice(0, 5).map((forecast) => (
                    <Box
                      key={forecast.productId}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className="bg-gray-50 p-2 rounded"
                    >
                      <Typography variant="body2" className="font-medium">
                        {forecast.name}
                      </Typography>
                      <Box display="flex" gap={2} alignItems="center">
                        <Chip
                          label={`Avg: ${forecast.averageDailySales} units/day`}
                          size="small"
                          className="bg-blue-50 text-blue-700"
                        />
                        <Chip
                          label={`Total: ${forecast.totalForecasted} units`}
                          size="small"
                          className="bg-purple-50 text-purple-700"
                        />
                      </Box>
                    </Box>
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

export default ForecastChart;

