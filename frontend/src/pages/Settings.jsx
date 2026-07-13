import React, { useState } from 'react';
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
  Input,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSettings } from '../context/SettingsContext';
import DashboardLayout from '../layout/DashboardLayout';

export default function SettingsPage() {
  const { settings, saveSettings, saveStatus } = useSettings();
  const [formData, setFormData] = useState({
    appName: settings.appName,
    themeColor: settings.themeColor,
    logo: settings.logo,
  });
  const [logoFile, setLogoFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB');
        return;
      }

      setLogoFile(file);
      
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          logo: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If there's a new logo file, convert it to base64
    let finalLogo = formData.logo;
    if (logoFile) {
      finalLogo = await convertFileToBase64(logoFile);
    }

    const success = await saveSettings({
      ...formData,
      logo: finalLogo
    });

    if (success) {
      setLogoFile(null); // Reset file input after successful save
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
    setFormData({
      appName: settings.appName,
      themeColor: settings.themeColor,
      logo: settings.logo,
    });
    setLogoFile(null);
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {/* Save Status Indicator */}
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

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* App Name */}
              <TextField
                fullWidth
                label="App Name"
                name="appName"
                value={formData.appName}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              {/* Theme Color */}
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="theme-color">Theme Color</InputLabel>
                <Input
                  id="theme-color"
                  name="themeColor"
                  type="color"
                  value={formData.themeColor}
                  onChange={handleInputChange}
                  sx={{ height: '56px' }}
                />
              </FormControl>

              {/* Logo Upload */}
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  App Logo
                </Typography>
                
                {/* Logo Preview */}
                {formData.logo && (
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '100px',
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    />
                  </Box>
                )}

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoChange}
                  />
                </Button>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Recommended: Square image, max 2MB
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  disabled={saveStatus === 'saving'}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saveStatus === 'saving'}
                  startIcon={saveStatus === 'saving' ? <CircularProgress size={20} /> : null}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Current Settings Preview */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Settings Preview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              {settings.logo && (
                <img
                  src={settings.logo}
                  alt="Current logo"
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'contain',
                  }}
                />
              )}
              <Typography variant="h6" sx={{ color: settings.themeColor }}>
                {settings.appName}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}