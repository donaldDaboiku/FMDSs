// components/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Save, 
  Refresh, 
  CloudUpload,
  Palette,
  Business,
  Notifications,
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';
import DashboardLayout from '../layout/DashboardLayout';

export default function SettingsPage() {
  const { settings, saveSettings, saveStatus, resetSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(settings.logo);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Update form when settings change
  useEffect(() => {
    setFormData(settings);
    setPreviewLogo(settings.logo);
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB');
        return;
      }

      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalLogo = previewLogo;
    if (logoFile) {
      finalLogo = await convertFileToBase64(logoFile);
    }

    const success = await saveSettings({
      ...formData,
      logo: finalLogo
    });

    if (success) {
      setLogoFile(null);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleReset = () => {
    resetSettings();
    setLogoFile(null);
  };

  // Font options
  const fontFamilies = [
    'Roboto',
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Tahoma'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'NGN',
    'CAD',
    'AUD',
    'INR'
  ];

  return (
    <DashboardLayout>
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, md: 3 },
        minHeight: '100vh'
      }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Settings
        </Typography>

        {/* Status Alerts */}
        {saveStatus === 'saving' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              Saving settings...
            </Box>
          </Alert>
        )}

        {saveStatus === 'saved' && (
          <Snackbar open={true} autoHideDuration={2000}>
            <Alert severity="success">
              Settings saved successfully!
            </Alert>
          </Snackbar>
        )}

        {saveStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error saving settings. Please try again.
          </Alert>
        )}

        {/* Wrap the entire content in a form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column - Settings Forms */}
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                // Prevent horizontal scroll on mobile
                overflow: 'hidden'
              }}>
                {/* App Branding Section */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business /> App Branding
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="App Name"
                          name="appName"
                          value={formData.appName}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Theme Color</InputLabel>
                          <Select
                            name="themeColor"
                            value={formData.themeColor}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="#3f51b5">Blue</MenuItem>
                            <MenuItem value="#f44336">Red</MenuItem>
                            <MenuItem value="#4caf50">Green</MenuItem>
                            <MenuItem value="#ff9800">Orange</MenuItem>
                            <MenuItem value="#9c27b0">Purple</MenuItem>
                            <MenuItem value="#607d8b">Gray</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            App Logo
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 3, 
                            mb: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            textAlign: { xs: 'center', sm: 'left' }
                          }}>
                            <Avatar
                              src={previewLogo}
                              sx={{ 
                                width: 80, 
                                height: 80, 
                                border: '2px dashed #ddd',
                                mb: { xs: 2, sm: 0 }
                              }}
                              variant="rounded"
                            >
                              {!previewLogo && 'Logo'}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                              <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={handleLogoChange}
                              />
                              <label htmlFor="logo-upload">
                                <Button
                                  variant="outlined"
                                  component="span"
                                  startIcon={<CloudUpload />}
                                  fullWidth={isMobile}
                                >
                                  Upload Logo
                                </Button>
                              </label>
                              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                Recommended: Square image, max 2MB
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Company Information */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business /> Company Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Phone"
                          name="companyPhone"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Company Email"
                          name="companyEmail"
                          value={formData.companyEmail}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Company Address"
                          name="companyAddress"
                          value={formData.companyAddress}
                          onChange={handleInputChange}
                          margin="normal"
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Theme & Appearance */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Palette /> Theme & Appearance
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Font Family</InputLabel>
                          <Select
                            name="fontFamily"
                            value={formData.fontFamily}
                            onChange={handleInputChange}
                          >
                            {fontFamilies.map(font => (
                              <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Font Size</InputLabel>
                          <Select
                            name="fontSize"
                            value={formData.fontSize}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="small">Small</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="large">Large</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="darkMode"
                              checked={formData.darkMode}
                              onChange={handleInputChange}
                            />
                          }
                          label="Dark Mode"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Business Settings */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business /> Business Settings
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Currency</InputLabel>
                          <Select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                          >
                            {currencies.map(currency => (
                              <MenuItem key={currency} value={currency}>
                                {currency}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax Rate (%)"
                          name="taxRate"
                          type="number"
                          value={formData.taxRate}
                          onChange={handleInputChange}
                          margin="normal"
                          InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Invoice Terms"
                          name="invoiceTerms"
                          value={formData.invoiceTerms}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Notifications & Language */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications /> Notifications & Language
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Language</InputLabel>
                          <Select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                          >
                            {languages.map(lang => (
                              <MenuItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Session Timeout (min)</InputLabel>
                          <Select
                            name="sessionTimeout"
                            value={formData.sessionTimeout}
                            onChange={handleInputChange}
                          >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="enableNotifications"
                              checked={formData.enableNotifications}
                              onChange={handleInputChange}
                            />
                          }
                          label="Enable Notifications"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="enableEmailAlerts"
                              checked={formData.enableEmailAlerts}
                              onChange={handleInputChange}
                            />
                          }
                          label="Enable Email Alerts"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="autoSave"
                              checked={formData.autoSave}
                              onChange={handleInputChange}
                            />
                          }
                          label="Auto Save"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="twoFactorAuth"
                              checked={formData.twoFactorAuth}
                              onChange={handleInputChange}
                            />
                          }
                          label="Two-Factor Authentication"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'flex-end',
                      flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleReset}
                        disabled={saveStatus === 'saving'}
                        startIcon={<Refresh />}
                        fullWidth={isMobile}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={saveStatus === 'saving'}
                        startIcon={saveStatus === 'saving' ? <CircularProgress size={20} /> : <Save />}
                        fullWidth={isMobile}
                      >
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Right Column - Preview - Only show on desktop */}
            {!isMobile && (
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  position: 'sticky', 
                  top: 100,
                  maxHeight: 'calc(100vh - 140px)',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#ccc',
                    borderRadius: '2px',
                  }
                }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Current Settings Preview
                      </Typography>
                      
                      <Paper 
                        sx={{ 
                          p: 3, 
                          mb: 3, 
                          backgroundColor: formData.themeColor,
                          color: 'white',
                          textAlign: 'center',
                          borderRadius: formData.borderRadius
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 2, 
                          mb: 2,
                          flexDirection: 'column'
                        }}>
                          {previewLogo && (
                            <Avatar
                              src={previewLogo}
                              sx={{ width: 60, height: 60 }}
                            />
                          )}
                          <Typography 
                            variant="h5" 
                            sx={{ fontFamily: formData.fontFamily }}
                          >
                            {formData.appName || 'Dammywiseheart Fashion'}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          Preview of your current settings
                        </Typography>
                      </Paper>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          <strong>Company:</strong> {formData.companyName || 'Not set'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          <strong>Currency:</strong> {formData.currency}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          <strong>Language:</strong> {languages.find(l => l.code === formData.language)?.name}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          <strong>Theme:</strong> {formData.darkMode ? 'Dark' : 'Light'}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          <strong>Font:</strong> {formData.fontFamily}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Box>
    </DashboardLayout>
  );
}