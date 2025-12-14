import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Typography,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { user, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleVerifyCurrentPassword = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setIsVerifying(true);

    // Verify current password by attempting login
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username, password: currentPassword }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsCurrentPasswordVerified(true);
        setSuccess('Current password verified successfully');
        setError('');
      } else {
        setError(data.message || 'Current password is incorrect');
        setIsCurrentPasswordVerified(false);
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      // Better error messages based on error type
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else if (error.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
      
      setIsCurrentPasswordVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      const successResult = await resetPassword(user.username, currentPassword, newPassword);

      if (successResult) {
        setSuccess('Password reset successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Error message is already set by the resetPassword function in AuthContext
        // But we can add a fallback
        if (!error) {
          setError('Failed to reset password. Please try again.');
        }
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An error occurred while resetting password. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              mb: 3,
              color: '#6b7280',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Back to Dashboard
          </Button>

          {/* Main Card */}
          <Card
            sx={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(to right, #2563eb, #1e40af)',
                padding: '32px',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <LockIcon sx={{ fontSize: '64px', marginBottom: '16px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Reset Password
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Verify your current password to set a new one
                </Typography>
              </motion.div>
            </Box>

            <CardContent sx={{ padding: '40px' }}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '24px' }}
                >
                  <Alert severity="error">{error}</Alert>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '24px' }}
                >
                  <Alert severity="success">{success}</Alert>
                </motion.div>
              )}

              {/* Current Password Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                  Step 1: Verify Current Password
                </Typography>

                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isCurrentPasswordVerified}
                  sx={{ marginBottom: '24px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          disabled={isCurrentPasswordVerified}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {!isCurrentPasswordVerified && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyCurrentPassword}
                    disabled={isVerifying || !currentPassword}
                    size="large"
                    sx={{
                      background: 'linear-gradient(to right, #2563eb, #1e40af)',
                      mb: 3,
                      py: 1.5,
                      fontSize: '16px',
                      fontWeight: 600,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #1e40af, #1e3a8a)',
                        boxShadow: '0 15px 20px -3px rgba(0, 0, 0, 0.15)',
                      },
                      '&:disabled': {
                        background: '#9ca3af',
                      },
                    }}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Current Password'}
                  </Button>
                )}

                {isCurrentPasswordVerified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginBottom: '32px' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                        border: '2px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 28 }} />
                      <Typography variant="body1" sx={{ color: '#15803d', fontWeight: 600 }}>
                        Current password verified successfully
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </motion.div>

              {/* New Password Fields - Animated appearance */}
              <AnimatePresence>
                {isCurrentPasswordVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <Box sx={{ mt: 4, pt: 4, borderTop: '2px solid #e5e7eb' }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>
                        Step 2: Set New Password
                      </Typography>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          variant="outlined"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          helperText="Password must be at least 6 characters long"
                          sx={{ marginBottom: '24px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="outlined"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          sx={{ marginBottom: '32px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleResetPassword}
                          disabled={!newPassword || !confirmPassword}
                          size="large"
                          sx={{
                            background: 'linear-gradient(to right, #2563eb, #1e40af)',
                            py: 1.5,
                            fontSize: '16px',
                            fontWeight: 600,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              background: 'linear-gradient(to right, #1e40af, #1e3a8a)',
                              boxShadow: '0 15px 20px -3px rgba(0, 0, 0, 0.15)',
                            },
                            '&:disabled': {
                              background: '#9ca3af',
                            },
                          }}
                        >
                          Reset Password
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

