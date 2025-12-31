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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Inventory as InventoryIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <SpeedIcon />, text: 'Lightning Fast' },
    { icon: <SecurityIcon />, text: 'Secure & Private' },
    { icon: <TrendingUpIcon />, text: 'Advanced Analytics' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        position: 'relative',
        overflow: 'hidden',
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

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', py: 4, position: 'relative', zIndex: 1 }}>
        <Grid container sx={{ minHeight: { xs: 'auto', md: '80vh' } }}>
          {/* Left Side - Branding (Hidden on mobile) */}
          {!isMobile && (
            <Grid item md={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: 4 }}>
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
                    Welcome Back!
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
                    Sign in to continue managing your inventory with powerful tools and insights.
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  {features.map((feature, index) => (
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
                          {feature.icon}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#37474f' }}>
                          {feature.text}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          )}

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 500,
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
                      Sign In
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Access your inventory management dashboard
                    </Typography>
                  </motion.div>
                </Box>

                <CardContent sx={{ p: 4 }}>
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

                    {/* Username Field */}
                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f5f5f5',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: '#eeeeee',
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

                    {/* Password Field */}
                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f5f5f5',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: '#eeeeee',
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
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </motion.div>

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" sx={{ color: '#90a4ae', px: 2 }}>
                        OR
                      </Typography>
                    </Divider>

                    {/* Register Link */}
                    <motion.div variants={itemVariants}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#546e7a', mb: 2 }}>
                          Don't have an account?
                        </Typography>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/register')}
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
                          Create New Account
                        </Button>
                      </Box>
                    </motion.div>
                  </motion.form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
