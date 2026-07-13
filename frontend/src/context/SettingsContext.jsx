// context/SettingsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    appName: 'FMDS',
    themeColor: '#3f51b5',
    logo: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    fontFamily: 'Roboto',
    fontSize: 'medium',
    borderRadius: '8px',
    darkMode: false,
    enableNotifications: true,
    enableEmailAlerts: true,
    autoSave: true,
    language: 'en',
    currency: 'USD',
    taxRate: 0,
    invoiceTerms: 'Net 30 days',
    sessionTimeout: 30,
    twoFactorAuth: false,
  });

  const [saveStatus, setSaveStatus] = useState('idle');
  const [loading, setLoading] = useState(true);

  // Load settings from backend
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // If backend fails, use localStorage as fallback
      const localSettings = localStorage.getItem('appSettings');
      if (localSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(localSettings) }));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setSaveStatus('saving');
      
      const token = localStorage.getItem('token');
      const updatedSettings = { ...settings, ...newSettings };

      // Save to backend
      const response = await axios.post('http://localhost:5000/api/settings', updatedSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state with response from server
      setSettings(response.data.settings || updatedSettings);
      
      // Also save to localStorage as backup
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Fallback to localStorage if backend fails
      const updatedSettings = { ...settings, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return false;
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      appName: 'FMDS',
      themeColor: '#3f51b5',
      logo: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      fontFamily: 'Roboto',
      fontSize: 'medium',
      borderRadius: '8px',
      darkMode: false,
      enableNotifications: true,
      enableEmailAlerts: true,
      autoSave: true,
      language: 'en',
      currency: 'USD',
      taxRate: 0,
      invoiceTerms: 'Net 30 days',
      sessionTimeout: 30,
      twoFactorAuth: false,
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    
    // Also reset on backend
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:5000/api/settings', defaultSettings, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  };

  const value = {
    settings,
    saveSettings,
    saveStatus,
    loading,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};