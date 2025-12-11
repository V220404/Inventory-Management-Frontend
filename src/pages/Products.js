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
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  QrCode as BarcodeIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Barcode from 'react-barcode';

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

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    barcode: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadProducts = () => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  };

  const saveProducts = (newProducts) => {
    localStorage.setItem('products', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const generateProductId = () => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    const nextId = stored.length + 1;
    return `INV-${100000 + nextId}`;
  };

  const generateBarcode = () => {
    // Generate a unique barcode string
    // Using timestamp + random number for uniqueness
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode.includes(searchTerm)
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
      setFormData(product);
    } else {
      setEditingProduct(null);
      const newBarcode = generateBarcode();
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        barcode: newBarcode,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      barcode: '',
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProducts = [...products];

    if (editingProduct) {
      const index = updatedProducts.findIndex((p) => p.id === editingProduct.id);
      updatedProducts[index] = {
        ...formData,
        id: editingProduct.id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
    } else {
      const newProduct = {
        ...formData,
        id: generateProductId(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
      };
      updatedProducts.push(newProduct);
    }

    saveProducts(updatedProducts);
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      saveProducts(updatedProducts);
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
                <Box className="flex gap-2">
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
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold">Product ID</TableCell>
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
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Chip label={product.category || 'N/A'} size="small" />
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.stock}
                          color={product.stock < 10 ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
                      <TableCell>
                        <Box className="flex gap-1">
                          <IconButton
                            size="small"
                            onClick={() => {
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
          {filteredProducts.length === 0 && (
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
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Electronics, Clothing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barcode"
                  value={formData.barcode}
                  disabled
                  helperText="Auto-generated"
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
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={barcodeDialogOpen} 
          onClose={() => setBarcodeDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: 2 },
              margin: { xs: 0, sm: 2 },
              maxHeight: { xs: '100vh', sm: '90vh' },
              width: { xs: '100%', sm: 'auto' }
            }
          }}
          fullScreen={isMobile}
        >
          <DialogContent 
            sx={{ 
              textAlign: 'center', 
              py: { xs: 4, sm: 6 }, 
              px: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 'auto', sm: 400 }
            }}
          >
            {selectedBarcodeProduct && (
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                {/* Barcode Display */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'white',
                    p: { xs: 2, sm: 4 },
                    mb: 3,
                    minHeight: { xs: 150, sm: 180 },
                    width: '100%',
                    overflow: 'auto',
                    borderRadius: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '& svg': {
                      maxWidth: '100%',
                      height: 'auto'
                    }
                  }}
                  id="barcode-container"
                >
                  {selectedBarcodeProduct.barcode ? (
                    <Box sx={{ 
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      overflowX: 'auto',
                      '& > svg': {
                        maxWidth: '100%',
                        height: 'auto'
                      }
                    }}>
                      <Barcode 
                        value={selectedBarcodeProduct.barcode}
                        width={isMobile ? 1.5 : 2}
                        height={isMobile ? 60 : 80}
                        displayValue={true}
                        fontSize={isMobile ? 12 : 16}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      No barcode available
                    </Typography>
                  )}
                </Box>
                {/* Barcode Number */}
                <Typography 
                  variant="h6" 
                  className="font-mono"
                  sx={{ 
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    fontWeight: 500,
                    letterSpacing: { xs: 1, sm: 2 },
                    color: '#1a1a1a',
                    mb: 4,
                    wordBreak: 'break-all',
                    px: { xs: 1, sm: 0 }
                  }}
                >
                  {selectedBarcodeProduct.barcode}
                </Typography>
                {/* Action Buttons */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 2, 
                    mt: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                    px: { xs: 2, sm: 0 }
                  }}
                >
                  <Button 
                    onClick={() => setBarcodeDialogOpen(false)}
                    variant="text"
                    fullWidth={isMobile}
                    sx={{ 
                      minWidth: { xs: '100%', sm: 100 },
                      textTransform: 'uppercase',
                      color: '#2196f3',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      py: { xs: 1.5, sm: 1 },
                      '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.08)'
                      }
                    }}
                  >
                    CLOSE
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    fullWidth={isMobile}
                    onClick={() => {
                      const printContent = document.getElementById('barcode-container');
                      if (printContent) {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <title>Barcode - ${selectedBarcodeProduct?.name}</title>
                              <meta charset="utf-8">
                              <style>
                                * {
                                  margin: 0;
                                  padding: 0;
                                  box-sizing: border-box;
                                }
                                @media print {
                                  body { 
                                    margin: 0;
                                    padding: 20px;
                                  }
                                  @page {
                                    margin: 0.5cm;
                                  }
                                }
                                body {
                                  display: flex;
                                  flex-direction: column;
                                  align-items: center;
                                  justify-content: center;
                                  padding: 40px 20px;
                                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                                  min-height: 100vh;
                                  background: white;
                                }
                                .barcode-wrapper {
                                  text-align: center;
                                  padding: 20px;
                                  background: white;
                                  width: 100%;
                                  max-width: 400px;
                                }
                                .barcode-number {
                                  font-size: 18px;
                                  font-weight: 500;
                                  font-family: 'Courier New', monospace;
                                  letter-spacing: 2px;
                                  margin-top: 15px;
                                  color: #1a1a1a;
                                  word-break: break-all;
                                }
                                .product-name {
                                  font-size: 16px;
                                  margin-bottom: 20px;
                                  font-weight: 500;
                                  color: #333;
                                }
                                svg {
                                  max-width: 100%;
                                  height: auto;
                                }
                              </style>
                            </head>
                            <body>
                              <div class="barcode-wrapper">
                                <div class="product-name">${selectedBarcodeProduct?.name}</div>
                                ${printContent.innerHTML}
                                <div class="barcode-number">${selectedBarcodeProduct?.barcode}</div>
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        setTimeout(() => {
                          printWindow.print();
                          printWindow.close();
                        }, 250);
                      }
                    }}
                    sx={{ 
                      minWidth: { xs: '100%', sm: 120 },
                      bgcolor: '#1976d2',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      py: { xs: 1.5, sm: 1 },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      '&:hover': { 
                        bgcolor: '#1565c0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    PRINT
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

