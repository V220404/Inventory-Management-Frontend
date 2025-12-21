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
  IconButton,
  Chip,
  Grid,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  QrCode as BarcodeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import apiRequest from '../utils/api';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

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
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcodeId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
      });
    }
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      let response;
      if (editingProduct) {
        // Update product
        response = await apiRequest(`/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
      } else {
        // Create product
        response = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        await loadProducts();
        setTimeout(() => {
          handleCloseDialog();
        }, 1000);
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Save product error:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Product deleted successfully!');
        await loadProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBarcode = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiRequest(`/products/${id}/regenerate-barcode`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Barcode regenerated successfully!');
        await loadProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to regenerate barcode');
      }
    } catch (err) {
      console.error('Regenerate barcode error:', err);
      setError('Failed to regenerate barcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            Add Product
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

        <Card className="shadow-lg rounded-xl mb-4">
          <CardContent>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          {loading && products.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold">Barcode ID</TableCell>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell className="font-semibold">Category</TableCell>
                    <TableCell className="font-semibold">Price</TableCell>
                    <TableCell className="font-semibold">Stock</TableCell>
                    <TableCell className="font-semibold">Barcode</TableCell>
                    <TableCell className="font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        component={TableRow}
                      >
                        <TableCell className="font-mono text-xs">{product.barcodeId}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Chip label={product.category || 'N/A'} size="small" />
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock}
                            color={product.stock < 10 ? 'error' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {product.barcodeImg ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 40,
                                cursor: 'pointer',
                                '&:hover': {
                                  opacity: 0.8,
                                },
                              }}
                              onClick={() => {
                                setSelectedBarcodeProduct(product);
                                setBarcodeDialogOpen(true);
                              }}
                            >
                              <img
                                src={product.barcodeImg.startsWith('data:')
                                  ? product.barcodeImg
                                  : `data:image/png;base64,${product.barcodeImg}`}
                                alt={`Barcode ${product.barcodeId}`}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                }}
                                onError={(e) => {
                                  console.error('Barcode thumbnail error for product:', product.id);
                                  e.target.style.display = 'none';
                                  // Show regenerate button on error
                                  const parent = e.target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<span style="color: red; font-size: 10px;">Regenerate</span>';
                                  }
                                }}
                              />
                            </Box>
                          ) : (
                            <Chip
                              label="Missing"
                              size="small"
                              color="error"
                              onClick={() => handleRegenerateBarcode(product.id)}
                              sx={{ cursor: 'pointer' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box className="flex gap-1">
                            <IconButton
                              size="small"
                              onClick={() => {
                                console.log('Opening barcode dialog for product:', product);
                                console.log('Barcode image:', product.barcodeImg ? 'Present' : 'Missing');
                                console.log('Barcode image preview:', product.barcodeImg?.substring(0, 100));
                                setSelectedBarcodeProduct(product);
                                setBarcodeDialogOpen(true);
                              }}
                              className="text-blue-500"
                            >
                              <BarcodeIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(product)}
                              className="text-green-500"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500"
                              disabled={loading}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {filteredProducts.length === 0 && !loading && (
            <Box className="text-center py-8">
              <Typography variant="body1" className="text-gray-500">
                No products found
              </Typography>
            </Box>
          )}
        </Card>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
                {success}
              </Alert>
            )}
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Electronics, Clothing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barcode ID"
                  value={editingProduct?.barcodeId || 'Auto-generated'}
                  disabled
                  helperText="Auto-generated when creating"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity *"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Barcode Dialog */}
        <Dialog 
          open={barcodeDialogOpen} 
          onClose={() => setBarcodeDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            {selectedBarcodeProduct && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedBarcodeProduct.name}
                </Typography>
                {selectedBarcodeProduct.barcodeImg ? (
                  <Box sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 120,
                  }}>
                    {(() => {
                      const imageSrc = selectedBarcodeProduct.barcodeImg.startsWith('data:') 
                        ? selectedBarcodeProduct.barcodeImg 
                        : `data:image/png;base64,${selectedBarcodeProduct.barcodeImg}`;
                      
                      console.log('Barcode image src length:', imageSrc.length);
                      console.log('Barcode image src preview:', imageSrc.substring(0, 100));
                      
                      return (
                        <img 
                          src={imageSrc}
                          alt={`Barcode ${selectedBarcodeProduct.barcodeId}`}
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto',
                            minHeight: 80,
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            padding: '15px',
                            backgroundColor: 'white',
                            display: 'block',
                          }}
                          onError={(e) => {
                            console.error('Barcode image load error');
                            console.error('Image src length:', imageSrc.length);
                            console.error('Image src starts with:', imageSrc.substring(0, 50));
                            console.error('Error event:', e);
                            // Show error message instead of hiding
                            const errorBox = document.createElement('div');
                            errorBox.textContent = 'Failed to load barcode image';
                            errorBox.style.color = 'red';
                            errorBox.style.padding = '10px';
                            e.target.parentNode.appendChild(errorBox);
                          }}
                          onLoad={() => {
                            console.log('Barcode image loaded successfully');
                          }}
                        />
                      );
                    })()}
                  </Box>
                ) : (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="error">
                      Barcode image not available
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Barcode ID: {selectedBarcodeProduct.barcodeId}
                    </Typography>
                  </Box>
                )}
                <Typography 
                  variant="h6" 
                  className="font-mono"
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    letterSpacing: 2,
                    color: '#1a1a1a',
                    mb: 3,
                  }}
                >
                  {selectedBarcodeProduct.barcodeId}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button 
                    onClick={() => setBarcodeDialogOpen(false)}
                    variant="outlined"
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => {
                      const barcodeImgSrc = selectedBarcodeProduct.barcodeImg?.startsWith('data:')
                        ? selectedBarcodeProduct.barcodeImg
                        : `data:image/png;base64,${selectedBarcodeProduct.barcodeImg}`;
                      
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Barcode - ${selectedBarcodeProduct.name}</title>
                            <style>
                              body {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                padding: 40px;
                                font-family: Arial, sans-serif;
                              }
                              .barcode-wrapper {
                                text-align: center;
                                padding: 20px;
                              }
                              .barcode-number {
                                font-size: 18px;
                                font-weight: 500;
                                font-family: monospace;
                                letter-spacing: 2px;
                                margin-top: 15px;
                              }
                              .product-name {
                                font-size: 16px;
                                margin-bottom: 20px;
                                font-weight: 500;
                              }
                              img {
                                max-width: 100%;
                                height: auto;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="barcode-wrapper">
                              <div class="product-name">${selectedBarcodeProduct.name}</div>
                              <img src="${barcodeImgSrc}" alt="Barcode" />
                              <div class="barcode-number">${selectedBarcodeProduct.barcodeId}</div>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                      }, 250);
                    }}
                  >
                    Print
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </Box>
  );
}
