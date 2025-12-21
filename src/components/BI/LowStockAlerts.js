import React, { useState, useEffect, memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Warning as WarningIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getLowStockAlerts } from '../../utils/api';
import { formatCurrency } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';

const LowStockAlerts = memo(function LowStockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [threshold]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getLowStockAlerts(threshold);
      if (response.success) {
        setAlerts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error loading low stock alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'error';
    if (stock <= threshold * 0.3) return 'error';
    if (stock <= threshold * 0.6) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <Card className="shadow-lg rounded-xl border border-gray-100">
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
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
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box className="bg-red-100 p-2 rounded-lg">
                <WarningIcon className="text-red-600" />
              </Box>
              <Box>
                <Typography variant="h6" className="font-bold text-gray-800">
                  Low Stock Alerts
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Products below threshold ({threshold} units)
                </Typography>
              </Box>
            </Box>
            {alerts.length > 0 && (
              <Chip
                label={`${alerts.length} items`}
                color="error"
                size="small"
                className="font-semibold"
              />
            )}
          </Box>

          {alerts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Box className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <CheckCircleIcon className="text-green-600 text-4xl" />
              </Box>
              <Typography variant="body1" className="text-gray-800 font-medium mb-1">
                All products well stocked
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                No items below the threshold
              </Typography>
            </Box>
          ) : (
            <>
              {alerts.filter((a) => a.stock === 0).length > 0 && (
                <Alert severity="error" className="mb-3">
                  {alerts.filter((a) => a.stock === 0).length} product(s) are out of stock!
                </Alert>
              )}
              <List className="p-0">
                {alerts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListItem
                      className="px-0 py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg mb-1 cursor-pointer"
                      onClick={() => navigate('/products')}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" className="font-medium text-gray-800">
                              {item.name}
                            </Typography>
                            <Chip
                              label={item.stock === 0 ? 'Out of Stock' : `${item.stock} units`}
                              color={getStockColor(item.stock)}
                              size="small"
                              className="font-semibold"
                            />
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Typography variant="body2" className="text-gray-600">
                              Category: {item.category} • Price: {formatCurrency(item.price)}
                            </Typography>
                            {item.stock > 0 && (
                              <Typography variant="caption" className="text-orange-600">
                                {((item.stock / threshold) * 100).toFixed(0)}% of threshold
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => navigate('/products')}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Manage Products
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default LowStockAlerts;

