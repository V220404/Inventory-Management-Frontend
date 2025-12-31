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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 2MB)
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
    
            // Validation
            if (!username || !firstName || !lastName || !contactNumber || !email || !password || !confirmPassword || !shopName || !fullAddress || !pincode) {
              setError('Please fill in all fields');
              return;
            }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

            const successResult = await register(username, firstName, lastName, contactNumber, email, password, profileImage, shopName, fullAddress, pincode);
    if (successResult) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      // Error message should be set by the register function in AuthContext
      // Use authError if available, otherwise show generic message
      if (authError) {
        setError(authError);
      } else if (!error) {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
        padding: '16px',
        position: 'relative',
        zIndex: 1
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 2 }}
      >
        <Card 
          sx={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2
          }}
        >
          <Box 
            sx={{
              background: 'linear-gradient(to right, #2563eb, #1e40af)',
              padding: '32px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              zIndex: 1
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <InventoryIcon sx={{ fontSize: '64px', marginBottom: '16px' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sign up to manage your inventory
              </Typography>
            </motion.div>
          </Box>
          <CardContent sx={{ padding: '32px', position: 'relative', zIndex: 1 }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '16px' }}
                >
                  <Alert severity="error">
                    {error}
                  </Alert>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: '16px' }}
                >
                  <Alert severity="success">
                    {success}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ marginBottom: '20px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 }}
              >
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{ marginBottom: '20px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ marginBottom: '20px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  label="Contact Number"
                  variant="outlined"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  sx={{ marginBottom: '20px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <TextField
                          fullWidth
                          label="Email ID"
                          type="email"
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ marginBottom: '20px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <TextField
                          fullWidth
                          label="Shop Name"
                          variant="outlined"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          sx={{ marginBottom: '20px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StoreIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <TextField
                          fullWidth
                          label="Full Address"
                          variant="outlined"
                          multiline
                          rows={3}
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          sx={{ marginBottom: '20px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <TextField
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          sx={{ marginBottom: '20px' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PinIcon sx={{ color: 'gray' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.48 }}
                style={{ marginBottom: '20px' }}
              >
                <Typography variant="body2" sx={{ mb: 1, color: '#6b7280', fontWeight: 500 }}>
                  Profile Image (Optional)
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: '2px dashed #d1d5db',
                    borderRadius: 2,
                    backgroundColor: '#f9fafb',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: '#f0f4ff',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {profileImagePreview ? (
                    <Box sx={{ position: 'relative', width: '100px', height: '100px' }}>
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '3px solid #2563eb',
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
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        bgcolor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: '40px', color: '#9ca3af' }} />
                    </Box>
                  )}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      sx={{
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        '&:hover': {
                          borderColor: '#1e40af',
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        },
                      }}
                    >
                      {profileImagePreview ? 'Change Image' : 'Upload Profile Image'}
                    </Button>
                  </label>
                  <Typography variant="caption" sx={{ color: '#6b7280', textAlign: 'center' }}>
                    Max size: 2MB
                  </Typography>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: '20px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <TextField
                  fullWidth
                  label="Re-try Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(to right, #2563eb, #1e40af)',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                    '&:hover': {
                      background: 'linear-gradient(to right, #1e40af, #1e3a8a)',
                    },
                  }}
                >
                  Register
                </Button>
              </motion.div>

              <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#2563eb', 
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

