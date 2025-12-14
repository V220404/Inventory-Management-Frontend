import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  QrCodeScanner as ScannerIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function POS() {
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [products, setProducts] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const loadProducts = () => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  };

  const handleBarcodeScan = (barcode) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      if (product.stock > 0) {
        addToCart(product);
        setBarcodeInput('');
      } else {
        alert('Product is out of stock!');
      }
    } else {
      alert('Product not found!');
    }
  };

  const handleBarcodeInput = (e) => {
    const value = e.target.value;
    setBarcodeInput(value);
    
    if (value.length >= 8 && (e.key === 'Enter' || value.length === 13)) {
      handleBarcodeScan(value);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Not enough stock available!');
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stock < 1) {
        alert('Product is out of stock!');
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            if (newQuantity > item.stock) {
              alert('Not enough stock available!');
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (cart.length > 0 && window.confirm('Clear the entire cart?')) {
      setCart([]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Validate stock availability
    const insufficientStock = cart.find((item) => item.quantity > item.stock);
    if (insufficientStock) {
      alert(`${insufficientStock.name} doesn't have enough stock!`);
      return;
    }

    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity,
        };
      }
      return product;
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    loadProducts();

    const transaction = {
      id: `TXN-${Date.now()}`,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: calculateTotal(),
      date: new Date().toISOString(),
    };

    // Save transaction
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    alert(`Transaction completed! Total: $${calculateTotal().toFixed(2)}`);
    setCart([]);
    setBarcodeInput('');
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-gray-800">
            POS / Billing System
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ScannerIcon />}
            onClick={() => setScannerOpen(true)}
          >
            Scanner
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="shadow-lg rounded-xl mb-4">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Scan Barcode or Enter Manually
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Scan or enter barcode..."
                  value={barcodeInput}
                  onChange={handleBarcodeInput}
                  onKeyPress={handleBarcodeInput}
                  inputRef={barcodeInputRef}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScannerIcon />
                      </InputAdornment>
                    ),
                  }}
                  className="mb-4"
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl">
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Shopping Cart
                  </Typography>
                  {cart.length > 0 && (
                    <Button
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={clearCart}
                      color="error"
                    >
                      Clear Cart
                    </Button>
                  )}
                </Box>
                
                {cart.length === 0 ? (
                  <Box className="text-center py-12">
                    <CartIcon className="text-6xl text-gray-300 mb-4" />
                    <Typography variant="body1" className="text-gray-500">
                      Cart is empty. Scan a product to get started.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ListItem className="hover:bg-gray-50 rounded-lg mb-2">
                            <ListItemText
                              primary={item.name}
                              secondary={
                                <Box className="flex items-center gap-2 mt-1">
                                  <Typography variant="body2" className="text-gray-600">
                                    ${item.price.toFixed(2)} each
                                  </Typography>
                                  <Chip
                                    label={`Stock: ${item.stock}`}
                                    size="small"
                                    color={item.stock < 10 ? 'warning' : 'default'}
                                  />
                                </Box>
                              }
                            />
                            <Box className="flex items-center gap-2 mr-4">
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography variant="body1" className="font-semibold min-w-[30px] text-center">
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                            <ListItemSecondaryAction>
                              <Box className="flex items-center gap-2">
                                <Typography variant="h6" className="font-semibold min-w-[80px] text-right">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                                <IconButton
                                  edge="end"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="shadow-lg rounded-xl sticky top-20">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Order Summary
                </Typography>
                
                <Box className="space-y-3 mb-4">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Items:
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Subtotal:
                    </Typography>
                    <Typography variant="body2">
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box className="flex justify-between">
                    <Typography variant="h6" className="font-semibold">
                      Total:
                    </Typography>
                    <Typography variant="h5" className="font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<MoneyIcon />}
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-600 py-3 text-base font-semibold"
                >
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={scannerOpen} onClose={() => setScannerOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Barcode Scanner</DialogTitle>
          <DialogContent>
            <Typography variant="body2" className="mb-4 text-gray-600">
              Point your device camera at a barcode or enter manually below.
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter barcode..."
              value={barcodeInput}
              onChange={handleBarcodeInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBarcodeScan(barcodeInput);
                  setScannerOpen(false);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScannerIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScannerOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
}

