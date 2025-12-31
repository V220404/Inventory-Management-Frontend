import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Inventory as InventoryIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccountCircle as AccountCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Pin as PinIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [shopName, setShopName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        setProfileImagePreview(base64String);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!username || !firstName || !lastName || !contactNumber || !email || !password || !confirmPassword || !shopName || !fullAddress || !pincode) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const successResult = await register(username, firstName, lastName, contactNumber, email, password, profileImage, shopName, fullAddress, pincode);
      if (successResult) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        if (authError) {
          setError(authError);
        } else if (!error) {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <BusinessIcon />, text: 'Manage Your Business' },
    { icon: <SecurityIcon />, text: 'Secure & Reliable' },
    { icon: <CheckCircleIcon />, text: 'Easy to Use' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 2, md: 4 },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
          top: -300,
          right: -300,
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(30px, -30px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(25, 118, 210, 0.08) 100%)',
          bottom: -200,
          left: -200,
          animation: 'float 15s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Left Side - Branding (Hidden on mobile) */}
          {!isMobile && (
            <Grid item md={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
                      }}
                    >
                      <InventoryIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      InventoryPro
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: '#1976d2',
                      mb: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    Get Started Today!
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#546e7a',
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Join thousands of businesses managing their inventory efficiently with our powerful platform.
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2.5,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            transform: 'translateX(8px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          {benefit.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#37474f' }}>
                          {benefit.text}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          )}

          {/* Right Side - Registration Form */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    p: 4,
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      top: -100,
                      right: -100,
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <InventoryIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      Create Account
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Sign up to start managing your inventory
                    </Typography>
                  </motion.div>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      maxHeight: { xs: '70vh', md: '65vh' },
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#2196f3',
                        borderRadius: '10px',
                        '&:hover': {
                          background: '#1976d2',
                        },
                      },
                    }}
                  >
                    <motion.form
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      onSubmit={handleSubmit}
                    >
                      {/* Back to Home Button */}
                      <motion.div variants={itemVariants}>
                        <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={() => navigate('/')}
                          sx={{
                            mb: 3,
                            color: '#546e7a',
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: 'rgba(33, 150, 243, 0.08)',
                            },
                          }}
                        >
                          Back to Home
                        </Button>
                      </motion.div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          variants={itemVariants}
                        >
                          <Alert
                            severity="error"
                            sx={{
                              mb: 3,
                              borderRadius: 2,
                              '& .MuiAlert-icon': {
                                alignItems: 'center',
                              },
                            }}
                            onClose={() => setError('')}
                          >
                            {error}
                          </Alert>
                        </motion.div>
                      )}

                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          variants={itemVariants}
                        >
                          <Alert
                            severity="success"
                            sx={{
                              mb: 3,
                              borderRadius: 2,
                            }}
                          >
                            {success}
                          </Alert>
                        </motion.div>
                      )}

                      {/* Personal Information Section */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                          Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccountCircleIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Email ID"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <EmailIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="First Name"
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PersonIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Last Name"
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PersonIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Contact Number"
                                variant="outlined"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PhoneIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Business Information Section */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                          Business Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Shop Name"
                                variant="outlined"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <StoreIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Full Address"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LocationIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Pincode"
                                variant="outlined"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PinIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Profile Image Section */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                          Profile Image (Optional)
                        </Typography>
                        <motion.div variants={itemVariants}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2,
                              p: 3,
                              border: '2px dashed #2196f3',
                              borderRadius: 2,
                              bgcolor: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#1976d2',
                                bgcolor: '#f0f7ff',
                              },
                            }}
                          >
                            {profileImagePreview ? (
                              <Box sx={{ position: 'relative', width: '120px', height: '120px' }}>
                                <img
                                  src={profileImagePreview}
                                  alt="Profile preview"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '3px solid #2196f3',
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setProfileImage(null);
                                    setProfileImagePreview(null);
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    bgcolor: 'white',
                                    boxShadow: 2,
                                    '&:hover': { bgcolor: '#fee2e2' },
                                  }}
                                >
                                  <Box component="span" sx={{ color: '#ef4444', fontSize: '18px' }}>×</Box>
                                </IconButton>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: '120px',
                                  height: '120px',
                                  borderRadius: '50%',
                                  bgcolor: '#e3f2fd',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <PhotoCameraIcon sx={{ fontSize: '48px', color: '#2196f3' }} />
                              </Box>
                            )}
                            <input
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="profile-image-upload"
                              type="file"
                              onChange={handleImageChange}
                              disabled={loading}
                            />
                            <label htmlFor="profile-image-upload">
                              <Button
                                variant="outlined"
                                component="span"
                                startIcon={<PhotoCameraIcon />}
                                disabled={loading}
                                sx={{
                                  borderColor: '#2196f3',
                                  color: '#2196f3',
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  '&:hover': {
                                    borderColor: '#1976d2',
                                    bgcolor: 'rgba(33, 150, 243, 0.08)',
                                  },
                                }}
                              >
                                {profileImagePreview ? 'Change Image' : 'Upload Profile Image'}
                              </Button>
                            </label>
                            <Typography variant="caption" sx={{ color: '#90a4ae', textAlign: 'center' }}>
                              Max size: 2MB
                            </Typography>
                          </Box>
                        </motion.div>
                      </Paper>

                      {/* Password Section */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                          Security
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LockIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#2196f3' }}
                                      >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <motion.div variants={itemVariants}>
                              <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                required
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    '&:hover': {
                                      bgcolor: '#f5f5f5',
                                    },
                                    '&.Mui-focused': {
                                      bgcolor: 'white',
                                      boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    },
                                  },
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LockIcon sx={{ color: '#2196f3' }} />
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: '#2196f3' }}
                                      >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Submit Button */}
                      <motion.div variants={itemVariants}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            mb: 3,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.5)',
                            },
                            '&:disabled': {
                              background: '#b0bec5',
                            },
                          }}
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </motion.div>

                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" sx={{ color: '#90a4ae', px: 2 }}>
                          OR
                        </Typography>
                      </Divider>

                      {/* Login Link */}
                      <motion.div variants={itemVariants}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#546e7a', mb: 2 }}>
                            Already have an account?
                          </Typography>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              borderColor: '#2196f3',
                              color: '#2196f3',
                              fontSize: '1rem',
                              fontWeight: 600,
                              textTransform: 'none',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#1976d2',
                                bgcolor: 'rgba(33, 150, 243, 0.08)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                              },
                            }}
                          >
                            Sign In Instead
                          </Button>
                        </Box>
                      </motion.div>
                    </motion.form>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
