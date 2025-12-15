import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

const BillPrint = ({ store, customer, paymentMode, products, billId, onClose }) => {
  // GST Configuration (18% total = 9% SGST + 9% CGST)
  const GST_PERCENT = 18;
  const SGST_PERCENT = 9;
  const CGST_PERCENT = 9;

  // Calculations
  const subtotal = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const gstAmount = (subtotal * GST_PERCENT) / 100;
  const sgstAmount = (subtotal * SGST_PERCENT) / 100;
  const cgstAmount = (subtotal * CGST_PERCENT) / 100;
  const grandTotal = subtotal + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        '@media print': {
          '@page': {
            size: 'A4',
            margin: '5mm',
          },
          '& *': {
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
          },
        },
      }}
    >
      <Paper
        sx={{
          maxWidth: 400,
          margin: 'auto',
          padding: 2,
          '@media print': {
            boxShadow: 'none',
            padding: '8px',
            maxWidth: '100%',
            margin: 0,
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          },
        }}
      >
        {/* Store Details */}
        <Box 
          textAlign="center" 
          sx={{ 
            mb: 1.5,
            '@media print': {
              mb: 0.5,
            },
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              mb: 0.5, 
              fontSize: '1.1rem',
              '@media print': {
                fontSize: '0.9rem',
                mb: 0.25,
              },
            }}
          >
            {store.name || 'Store Name'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem', 
              display: 'block',
              '@media print': {
                fontSize: '0.65rem',
                lineHeight: 1.2,
              },
            }}
          >
            {store.address || 'Address'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem', 
              display: 'block',
              '@media print': {
                fontSize: '0.65rem',
                lineHeight: 1.2,
              },
            }}
          >
            Contact: {store.contactNumber || 'Contact Number'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem', 
              display: 'block',
              '@media print': {
                fontSize: '0.65rem',
                lineHeight: 1.2,
              },
            }}
          >
            Pincode: {store.pincode || 'Pincode'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1, '@media print': { my: 0.5 } }} />

        {/* Bill ID and Date */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1,
            '@media print': {
              mb: 0.5,
            },
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem',
              '@media print': {
                fontSize: '0.65rem',
              },
            }}
          >
            <strong>Bill ID:</strong> {billId || 'N/A'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem',
              '@media print': {
                fontSize: '0.65rem',
              },
            }}
          >
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5, '@media print': { my: 0.25 } }} />

        {/* Customer Details */}
        <Box 
          sx={{ 
            mb: 1,
            '@media print': {
              mb: 0.5,
            },
          }}
        >
          <Typography 
            variant="body2" 
            fontWeight="bold" 
            sx={{ 
              mb: 0.25, 
              fontSize: '0.85rem',
              '@media print': {
                fontSize: '0.7rem',
                mb: 0.1,
              },
            }}
          >
            Customer: {customer.name || 'Walk-in Customer'}
          </Typography>
          {customer.contactNumber && (
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              Contact: {customer.contactNumber}
            </Typography>
          )}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem',
              display: 'block',
              mt: 0.25,
              '@media print': {
                fontSize: '0.65rem',
                mt: 0.1,
              },
            }}
          >
            Payment Mode: <strong>{paymentMode || 'Cash'}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 1, '@media print': { my: 0.5 } }} />

        {/* Product Table */}
        <TableContainer
          sx={{
            '@media print': {
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            },
          }}
        >
          <Table 
            size="small" 
            sx={{ 
              '& .MuiTableCell-root': { 
                padding: '4px 8px', 
                fontSize: '0.75rem',
                '@media print': {
                  padding: '2px 4px',
                  fontSize: '0.65rem',
                  lineHeight: 1.2,
                },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', '@media print': { fontSize: '0.7rem' } }}>
                  Product
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.8rem', '@media print': { fontSize: '0.7rem' } }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.8rem', '@media print': { fontSize: '0.7rem' } }}>
                  Rate
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.8rem', '@media print': { fontSize: '0.7rem' } }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: '0.75rem', '@media print': { fontSize: '0.65rem' } }}>{item.name}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem', '@media print': { fontSize: '0.65rem' } }}>{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem', '@media print': { fontSize: '0.65rem' } }}>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem', '@media print': { fontSize: '0.65rem' } }}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 1, '@media print': { my: 0.5 } }} />

        {/* Bill Summary */}
        <Box 
          sx={{ 
            mt: 1,
            '@media print': {
              mt: 0.5,
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
              '@media print': {
                mb: 0.25,
              },
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              Subtotal
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.25,
              '@media print': {
                mb: 0.1,
              },
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              SGST ({SGST_PERCENT}%)
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              ₹{sgstAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
              '@media print': {
                mb: 0.25,
              },
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              CGST ({CGST_PERCENT}%)
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                '@media print': {
                  fontSize: '0.65rem',
                },
              }}
            >
              ₹{cgstAmount.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5, '@media print': { my: 0.25 } }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
              '@media print': {
                mt: 0.5,
              },
            }}
          >
            <Typography 
              variant="body1" 
              fontWeight="bold" 
              sx={{ 
                fontSize: '0.95rem',
                '@media print': {
                  fontSize: '0.8rem',
                },
              }}
            >
              Grand Total
            </Typography>
            <Typography 
              variant="body1" 
              fontWeight="bold" 
              sx={{ 
                fontSize: '0.95rem',
                '@media print': {
                  fontSize: '0.8rem',
                },
              }}
            >
              ₹{grandTotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, '@media print': { my: 0.5 } }} />

        {/* Footer */}
        <Box 
          textAlign="center"
          sx={{
            '@media print': {
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            },
          }}
        >
          <Typography 
            variant="caption" 
            fontWeight="bold" 
            sx={{ 
              fontSize: '0.8rem',
              '@media print': {
                fontSize: '0.7rem',
              },
            }}
          >
            Thank You! Visit Again 😊
          </Typography>
        </Box>
      </Paper>

      {/* Print Button (Hidden in print view) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 3,
          '@media print': { display: 'none' },
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            background: 'linear-gradient(to right, #2563eb, #1e40af)',
            '&:hover': {
              background: 'linear-gradient(to right, #1e40af, #1e3a8a)',
            },
          }}
        >
          Print Bill
        </Button>
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BillPrint;
