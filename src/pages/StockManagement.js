import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import apiRequest from '../utils/api';

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data?.products || data.data || []);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Load products error:', err);
      setError('Failed to load products. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by stock level (lowest first)
    filtered.sort((a, b) => a.stock - b.stock);

    setFilteredProducts(filtered);
  };

  const handleOpenAdjustDialog = (product) => {
    setSelectedProduct(product);
    setAdjustmentAmount(0);
    setAdjustmentType('add');
    setAdjustDialogOpen(true);
  };

  const handleCloseAdjustDialog = () => {
    setAdjustDialogOpen(false);
    setSelectedProduct(null);
    setAdjustmentAmount(0);
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct || adjustmentAmount <= 0) {
      setError('Please enter a valid adjustment amount');
      return;
    }

    const newStock =
      adjustmentType === 'add'
        ? selectedProduct.stock + parseInt(adjustmentAmount)
        : selectedProduct.stock - parseInt(adjustmentAmount);

    if (newStock < 0) {
      setError('Stock cannot be negative!');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiRequest(`/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: selectedProduct.name,
          category: selectedProduct.category,
          price: selectedProduct.price,
          stock: newStock,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Stock updated successfully!');
        await loadProducts();
        handleCloseAdjustDialog();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update stock');
      }
    } catch (err) {
      console.error('Update stock error:', err);
      setError('Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLowStockItems = () => {
    return products.filter((p) => p.stock < 10);
  };

  const getOutOfStockItems = () => {
    return products.filter((p) => p.stock === 0);
  };

  const lowStockCount = getLowStockItems().length;
  const outOfStockCount = getOutOfStockItems().length;

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Stock Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadProducts}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading && products.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl border-l-4 border-yellow-500">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Low Stock Items
                      </Typography>
                      <Typography variant="h4" className="font-bold text-yellow-600">
                        {lowStockCount}
                      </Typography>
                    </Box>
                    <WarningIcon className="text-4xl text-yellow-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl border-l-4 border-red-500">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Out of Stock
                      </Typography>
                      <Typography variant="h4" className="font-bold text-red-600">
                        {outOfStockCount}
                      </Typography>
                    </Box>
                    <WarningIcon className="text-4xl text-red-500" />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-lg rounded-xl border-l-4 border-green-500">
                <CardContent>
                  <Box className="flex justify-between items-center">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        Total Products
                      </Typography>
                      <Typography variant="h4" className="font-bold text-green-600">
                        {products.length}
                      </Typography>
                    </Box>
                    <Box className="text-4xl text-green-500">📦</Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <Card className="shadow-lg rounded-xl mb-4">
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-4">
              Product Stock Levels
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold">Product ID</TableCell>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell className="font-semibold">Category</TableCell>
                    <TableCell className="font-semibold">Current Stock</TableCell>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell className="font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => {
                      const isLowStock = product.stock < 10;
                      const isOutOfStock = product.stock === 0;

                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.03 }}
                          component={TableRow}
                          className={isLowStock ? 'bg-yellow-50' : ''}
                        >
                          <TableCell>{product.id}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Chip label={product.category || 'N/A'} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              className={`font-semibold ${
                                isOutOfStock
                                  ? 'text-red-600'
                                  : isLowStock
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {product.stock}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {isOutOfStock ? (
                              <Chip label="Out of Stock" color="error" size="small" />
                            ) : isLowStock ? (
                              <Chip label="Low Stock" color="warning" size="small" />
                            ) : (
                              <Chip label="In Stock" color="success" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenAdjustDialog(product)}
                            >
                              Adjust
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
            {filteredProducts.length === 0 && (
              <Box className="text-center py-8">
                <Typography variant="body1" className="text-gray-500">
                  No products found
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog open={adjustDialogOpen} onClose={handleCloseAdjustDialog}>
          <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
          <DialogContent>
            <Box className="mt-4 space-y-4">
              <Typography variant="body2" className="text-gray-600">
                Current Stock: <strong>{selectedProduct?.stock || 0}</strong>
              </Typography>
              <Box className="flex gap-2">
                <Button
                  variant={adjustmentType === 'add' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('add')}
                  startIcon={<AddIcon />}
                >
                  Add Stock
                </Button>
                <Button
                  variant={adjustmentType === 'remove' ? 'contained' : 'outlined'}
                  onClick={() => setAdjustmentType('remove')}
                  color="error"
                  startIcon={<RemoveIcon />}
                >
                  Remove Stock
                </Button>
              </Box>
              <TextField
                fullWidth
                label="Adjustment Amount"
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
              {selectedProduct && adjustmentAmount > 0 && (
                <Typography variant="body2" className="text-gray-600">
                  New Stock after adjustment:{' '}
                  <strong>
                    {adjustmentType === 'add'
                      ? selectedProduct.stock + parseInt(adjustmentAmount || 0)
                      : selectedProduct.stock - parseInt(adjustmentAmount || 0)}
                  </strong>
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdjustDialog}>Cancel</Button>
            <Button onClick={handleAdjustStock} variant="contained">
              Apply Adjustment
            </Button>
          </DialogActions>
        </Dialog>
        </>
        )}
      </motion.div>
    </Box>
  );
}

