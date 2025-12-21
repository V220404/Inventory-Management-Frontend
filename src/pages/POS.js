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
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  QrCodeScanner as ScannerIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  Clear as ClearIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { formatCurrency } from '../utils/currency';
import {
  getProductByBarcode,
  createBill,
  addItemToBill,
  getBill,
  updateBillItem,
  removeBillItem,
  checkoutBill,
} from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BillPrint from '../components/BillPrint';

export default function POS() {
  const { user } = useAuth();
  const [billId, setBillId] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraScanning, setCameraScanning] = useState(false);
  const [isScanningPaused, setIsScanningPaused] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [billPrintOpen, setBillPrintOpen] = useState(false);
  const [completedBillData, setCompletedBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const barcodeInputRef = useRef(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Create bill on component mount
  useEffect(() => {
    initializeBill();
    
    // Cleanup camera on unmount
    return () => {
      if (html5QrCodeRef.current) {
        stopCameraScan();
      }
    };
  }, []);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Auto-start camera when scanner dialog opens
  useEffect(() => {
    if (scannerOpen && !cameraScanning && !html5QrCodeRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startCameraScan();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scannerOpen]);

  const initializeBill = async (forceNew = false) => {
    // Don't create a new bill if we already have one (unless forced)
    if (billId && !forceNew) {
      await loadBill(billId);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await createBill(user?.username);
      if (response.success) {
        const newBillId = response.data.billId;
        setBillId(newBillId);
        await loadBill(newBillId);
      } else {
        setError(response.message || 'Failed to create bill');
        setLoading(false);
      }
    } catch (err) {
      console.error('Initialize bill error:', err);
      setError('Failed to initialize billing session');
      setLoading(false);
    }
  };

  const loadBill = async (currentBillId) => {
    if (!currentBillId) {
      setBillItems([]);
      setGrandTotal(0);
      return;
    }
    
    try {
      const response = await getBill(currentBillId, user?.username);
      if (response.success) {
        setBillItems(response.data.items || []);
        setGrandTotal(response.data.grandTotal || 0);
      } else {
        // If bill not found, reset state
        setBillItems([]);
        setGrandTotal(0);
      }
    } catch (err) {
      console.error('Load bill error:', err);
      setBillItems([]);
      setGrandTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    if (!barcode || !barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    if (!billId) {
      setError('Bill not initialized. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Fetch product by barcode
      const productResponse = await getProductByBarcode(barcode.trim(), user?.username);
      
      if (!productResponse.success) {
        setError(productResponse.message || 'Product not found');
        setBarcodeInput('');
        setLoading(false);
        return;
      }

      const product = productResponse.data;

      // Check stock
      if (product.stock <= 0) {
        setError('Product is out of stock!');
        setBarcodeInput('');
        setLoading(false);
        return;
      }

      // Add to bill (default quantity: 1)
      const addResponse = await addItemToBill(billId, user?.username, {
        barcodeId: product.barcodeId,
        quantity: 1,
      });

      if (addResponse.success) {
        setSuccess(`${product.name} added to cart!`);
        setBarcodeInput('');
        await loadBill(billId);
        
        // Show success message briefly on POS page
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(addResponse.message || 'Failed to add product to cart');
        // Clear error after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Barcode scan error:', err);
      setError(err.message || 'Failed to scan barcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeInput = (e) => {
    const value = e.target.value;
    setBarcodeInput(value);
    
    // Auto-scan on Enter or when barcode length is sufficient
    if (e.key === 'Enter' || (value.length >= 8 && value.length <= 20)) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBarcodeScan(value);
      }
    }
  };

  const updateQuantity = async (itemId, change) => {
    const item = billItems.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      // Remove item
      await removeItem(itemId);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await updateBillItem(billId, itemId, user?.username, newQuantity);
      
      if (response.success) {
        await loadBill(billId);
      } else {
        setError(response.message || 'Failed to update quantity');
      }
    } catch (err) {
      console.error('Update quantity error:', err);
      setError(err.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    setError('');

    try {
      const response = await removeBillItem(billId, itemId, user?.username);
      
      if (response.success) {
        await loadBill(billId);
      } else {
        setError(response.message || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Remove item error:', err);
      setError(err.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (billItems.length === 0) return;
    
    if (!window.confirm('Clear the entire cart?')) {
      return;
    }

    // Remove all items one by one
    setLoading(true);
    try {
      for (const item of billItems) {
        await removeBillItem(billId, item.id, user?.username);
      }
      await loadBill(billId);
    } catch (err) {
      console.error('Clear cart error:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    if (billItems.length === 0) {
      setError('Cart is empty!');
      return;
    }
    // Open customer details dialog first
    setCustomerDialogOpen(true);
  };

  const handleCustomerSubmit = () => {
    if (!customerName.trim()) {
      setError('Please enter customer name');
      return;
    }
    // Close customer dialog and open checkout confirmation
    setCustomerDialogOpen(false);
    setCheckoutDialogOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    setCheckoutDialogOpen(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await checkoutBill(billId, user?.username);
      
      if (response.success) {
        // Store bill data for printing
        setCompletedBillData({
          store: {
            name: user?.shopName || 'Store Name',
            address: user?.fullAddress || 'Address',
            contactNumber: user?.contactNumber || 'Contact Number',
            pincode: user?.pincode || 'Pincode',
          },
          customer: {
            name: customerName,
            contactNumber: customerContact || '',
          },
          paymentMode: paymentMode,
          products: billItems,
          billId: billId,
          grandTotal: grandTotal,
        });

        // Open bill print dialog
        setBillPrintOpen(true);
        
        // Clear current bill items and total immediately
        setBillItems([]);
        setGrandTotal(0);
        
        // Reset customer details
        setCustomerName('');
        setCustomerContact('');
        setPaymentMode('Cash');
        
        // Create new bill for next sale after a delay
        setTimeout(async () => {
          setSuccess(''); // Clear success message
          setLoading(true); // Show loading while creating new bill
          await initializeBill(true); // Create new bill (force new since old is completed)
        }, 2000);
      } else {
        setError(response.message || 'Failed to complete sale');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete sale. Please try again.');
      setLoading(false);
    }
  };

  const handleBillPrintClose = () => {
    setBillPrintOpen(false);
    setCompletedBillData(null);
  };

  const startCameraScan = async () => {
    try {
      setCameraScanning(true);
      setError('');
      setIsScanningPaused(false);
      
      const html5QrCode = new Html5Qrcode('scanner-container');
      html5QrCodeRef.current = html5QrCode;

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        throw new Error('No cameras found');
      }

      // Prefer back camera, fallback to first available
      const cameraId = cameras.find(cam => cam.label.toLowerCase().includes('back'))?.id || cameras[0].id;

      // Start scanning
      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
          ],
        },
        async (decodedText, decodedResult) => {
          // Barcode detected - stop camera and close modal
          console.log('Barcode detected:', decodedText);
          
          // Stop camera immediately
          if (html5QrCodeRef.current) {
            try {
              await html5QrCodeRef.current.stop();
              await html5QrCodeRef.current.clear();
              html5QrCodeRef.current = null;
              setCameraScanning(false);
            } catch (err) {
              console.error('Error stopping camera:', err);
            }
          }
          
          // Close modal immediately
          setScannerOpen(false);
          setBarcodeInput('');
          
          // Process the barcode scan
          handleBarcodeScan(decodedText);
        },
        (errorMessage) => {
          // Ignore errors (scanning in progress)
          if (!errorMessage.includes('No MultiFormat Readers')) {
            // Silent - scanning is working
          }
        }
      );
    } catch (err) {
      console.error('Camera scan error:', err);
      setError(err.message || 'Failed to start camera. Please check permissions and try again.');
      setCameraScanning(false);
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (stopErr) {
          // Ignore stop errors
        }
        html5QrCodeRef.current = null;
      }
    }
  };

  const stopCameraScan = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Stop camera error:', err);
      }
      html5QrCodeRef.current = null;
    }
    setCameraScanning(false);
  };

  const handleScannerClose = async () => {
    if (cameraScanning && html5QrCodeRef.current) {
      await stopCameraScan();
    }
          setScannerOpen(false);
          setBarcodeInput('');
    setError(''); // Clear any errors when closing
  };


  const totalItems = billItems.reduce((sum, item) => sum + item.quantity, 0);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Creating new bill...
                </Typography>
              </Box>
            )}
            {billId && (
              <Chip
                label={`Bill: ${billId}`}
                color="primary"
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<ScannerIcon />}
              onClick={() => setScannerOpen(true)}
              disabled={loading}
            >
              Scanner
            </Button>
          </Box>
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

        {billId ? (
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
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={handleBarcodeInput}
                    inputRef={barcodeInputRef}
                    disabled={loading}
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
                    {billItems.length > 0 && (
                      <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={clearCart}
                        color="error"
                        disabled={loading}
                      >
                        Clear Cart
                      </Button>
                    )}
                  </Box>
                  
                  {billItems.length === 0 ? (
                    <Box className="text-center py-12">
                      <CartIcon className="text-6xl text-gray-300 mb-4" />
                      <Typography variant="body1" className="text-gray-500">
                        Cart is empty. Scan a product to get started.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <AnimatePresence>
                            {billItems.map((item, index) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                component={TableRow}
                                sx={{
                                  '&:hover': { backgroundColor: '#f9fafb' },
                                  '&:last-child td': { borderBottom: 0 },
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {item.barcodeId}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => updateQuantity(item.id, -1)}
                                      disabled={loading}
                                      sx={{ 
                                        border: '1px solid #e0e0e0',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                      }}
                                    >
                                      <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        fontWeight: 600,
                                        minWidth: '40px',
                                        textAlign: 'center'
                                      }}
                                    >
                                      {item.quantity}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => updateQuantity(item.id, 1)}
                                      disabled={loading}
                                      sx={{ 
                                        border: '1px solid #e0e0e0',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                      }}
                                    >
                                      <AddIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {formatCurrency(item.price)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(item.total)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => removeItem(item.id)}
                                    disabled={loading}
                                    sx={{ 
                                      color: 'error.main',
                                      '&:hover': { backgroundColor: 'error.light', color: 'error.dark' }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </TableContainer>
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
                        {totalItems}
                      </Typography>
                    </Box>
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Subtotal:
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(grandTotal)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box className="flex justify-between">
                      <Typography variant="h6" className="font-semibold">
                        Total:
                      </Typography>
                      <Typography variant="h5" className="font-bold text-blue-600">
                        {formatCurrency(grandTotal)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MoneyIcon />}
                    onClick={handleCheckoutClick}
                    disabled={billItems.length === 0 || loading}
                    className="bg-gradient-to-r from-green-500 to-green-600 py-3 text-base font-semibold"
                  >
                    {loading ? 'Processing...' : 'Checkout'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        <Dialog 
          open={scannerOpen} 
          onClose={handleScannerClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              minHeight: '500px',
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CameraIcon />
              <Typography variant="h6">Camera Scanner</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box>
              <Typography variant="body2" className="mb-4 text-gray-600">
                Point your device camera at a barcode. The product will be added automatically when detected.
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  id="scanner-container"
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: '300px',
                  }}
                />
                {!cameraScanning && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress sx={{ color: 'white' }} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'white' }}>
                      Starting camera...
                    </Typography>
                  </Box>
                )}
              </Box>
              {cameraScanning && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Chip
                    label="Scanning..."
                    color="primary"
                    icon={<CameraIcon />}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            {cameraScanning && (
              <Button onClick={stopCameraScan} color="warning">
                Stop Camera
              </Button>
            )}
            <Button onClick={handleScannerClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Checkout Confirmation Dialog */}
        <Dialog
          open={checkoutDialogOpen}
          onClose={() => setCheckoutDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MoneyIcon sx={{ color: '#22c55e', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937' }}>
                Confirm Checkout
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                Are you sure you want to complete this sale?
              </Typography>
              
              <Box
                sx={{
                  backgroundColor: '#f9fafb',
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Items:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {totalItems}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  This action will reduce stock quantities and create a sale record.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setCheckoutDialogOpen(false)}
              variant="outlined"
              sx={{
                minWidth: 120,
                borderColor: '#e5e7eb',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#d1d5db',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckoutConfirm}
              variant="contained"
              startIcon={<MoneyIcon />}
              sx={{
                minWidth: 120,
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(to right, #16a34a, #15803d)',
                },
              }}
            >
              Confirm Sale
            </Button>
          </DialogActions>
        </Dialog>

        {/* Customer Details Dialog */}
        <Dialog
          open={customerDialogOpen}
          onClose={() => {
            setCustomerDialogOpen(false);
            setCustomerName('');
            setCustomerContact('');
            setPaymentMode('Cash');
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
              Customer Details
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 4, pb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                fullWidth
                label="Customer Name"
                variant="outlined"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'gray' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Contact Number (Optional)"
                variant="outlined"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: 'gray' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                  Payment Mode
                </Typography>
                <RadioGroup
                  row
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  sx={{ gap: 2 }}
                >
                  <FormControlLabel
                    value="Cash"
                    control={<Radio size="small" />}
                    label="Cash"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                  <FormControlLabel
                    value="Online"
                    control={<Radio size="small" />}
                    label="Online"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
            <Button 
              onClick={() => {
                setCustomerDialogOpen(false);
                setCustomerName('');
                setCustomerContact('');
                setPaymentMode('Cash');
              }} 
              variant="outlined" 
              size="large"
              sx={{ minWidth: 120, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCustomerSubmit} 
              variant="contained" 
              size="large"
              disabled={!customerName.trim()}
              sx={{
                minWidth: 120,
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                '&:hover': {
                  background: 'linear-gradient(to right, #16a34a, #15803d)',
                },
                textTransform: 'none',
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bill Print Dialog */}
        {completedBillData && (
          <Dialog
            open={billPrintOpen}
            onClose={handleBillPrintClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                '@media print': {
                  boxShadow: 'none',
                  margin: 0,
                  maxWidth: '100%',
                  borderRadius: 0,
                },
              }
            }}
            sx={{
              '@media print': {
                '& .MuiDialog-container': {
                  alignItems: 'flex-start',
                },
                '& .MuiDialog-paper': {
                  margin: 0,
                  maxHeight: '100%',
                },
              }
            }}
          >
            <Box sx={{ '@media print': { display: 'none' } }}>
              <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Bill Receipt
                </Typography>
              </DialogTitle>
            </Box>
            <DialogContent sx={{ p: 3, '@media print': { p: 2 } }}>
              <BillPrint
                store={completedBillData.store}
                customer={completedBillData.customer}
                products={completedBillData.products}
                billId={completedBillData.billId}
                onClose={handleBillPrintClose}
              />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </Box>
  );
}
