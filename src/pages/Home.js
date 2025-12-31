import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Bolt as BoltIcon,
  Lock as LockIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
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

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const features = [
    {
      icon: <BoltIcon />,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized infrastructure. Get things done in record time without any lag or delays.',
    },
    {
      icon: <LockIcon />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. End-to-end encryption ensures your information stays private.',
    },
    {
      icon: <PeopleIcon />,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team in real-time. Share, comment, and collaborate on projects effortlessly.',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Advanced Analytics',
      description: 'Get insights into your productivity with detailed analytics. Track progress and make data-driven decisions.',
    },
    {
      icon: <LanguageIcon />,
      title: 'Cross-Platform',
      description: 'Access your workspace from any device, anywhere. Available on web, iOS, Android, and desktop.',
    },
    {
      icon: <PaletteIcon />,
      title: 'Customizable',
      description: 'Tailor the platform to your needs with extensive customization options. Make it truly yours.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          color: '#333',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
          <Typography
            variant="h5"
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body1" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  Welcome, {user?.username || 'User'}!
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  sx={{ borderColor: '#2196f3', color: '#2196f3' }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ borderColor: '#2196f3', color: '#2196f3' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: 10,
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            width: 500,
            height: 500,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            top: -250,
            right: -250,
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
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            bottom: -200,
            left: -200,
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 8 }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {isAuthenticated ? (
              <>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: 3,
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    You're Logged In
                  </Box>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    Welcome back, {user?.username || 'User'}!
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 2,
                      fontWeight: 300,
                    }}
                  >
                    Continue Your Journey with InventoryPro
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      maxWidth: 600,
                      mx: 'auto',
                      mb: 4,
                    }}
                  >
                    You're all set! Explore our powerful features and take your productivity to the next level.
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                      sx={{
                        bgcolor: 'white',
                        color: '#2196f3',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      View Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      Explore Features
                    </Button>
                  </Box>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      fontWeight: 800,
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    Transform Your Inventory Management
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 2,
                      fontWeight: 300,
                    }}
                  >
                    Introducing InventoryPro
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      maxWidth: 600,
                      mx: 'auto',
                      mb: 4,
                    }}
                  >
                    The all-in-one inventory management platform that helps businesses track, organize,
                    and manage their inventory efficiently. Experience the future of inventory management today.
                  </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        bgcolor: 'white',
                        color: '#2196f3',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </motion.div>
              </>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
              Powerful Features
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', maxWidth: 600, mx: 'auto' }}>
              Everything you need to boost productivity and streamline your inventory management
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: 3,
                      bgcolor: '#f8f9fa',
                      border: '1px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        borderColor: '#2196f3',
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.5rem',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: 6,
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'white', textAlign: 'center' }}>
        <Container maxWidth="md">
          {isAuthenticated ? (
            <>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                Ready to Explore More?
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                Discover advanced features and unlock the full potential of InventoryPro
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(33, 150, 243, 0.4)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                Join thousands of businesses already using InventoryPro to transform their inventory management
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(33, 150, 243, 0.4)',
                  },
                }}
              >
                Start Your Free Trial
              </Button>
            </>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#1a1a1a',
          color: 'white',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component="a"
              href="#features"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Features
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Pricing
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              About Us
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Contact
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Privacy Policy
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', '&:hover': { color: 'white' } }}
            >
              Terms of Service
            </Typography>
          </Box>
          <Box
            sx={{
              pt: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <Typography variant="body2">
              &copy; 2024 InventoryPro. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

