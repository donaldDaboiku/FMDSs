import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Settings from "../models/Settings.js";

const router = express.Router();

// Get user settings
router.get("/", protect, async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        user: req.user.id,
        appName: 'FMDS',
        themeColor: '#3f51b5',
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
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Update user settings
router.post("/", protect, async (req, res) => {
  try {
    const {
      appName,
      themeColor,
      logo,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      fontFamily,
      fontSize,
      borderRadius,
      darkMode,
      enableNotifications,
      enableEmailAlerts,
      autoSave,
      language,
      currency,
      taxRate,
      invoiceTerms,
      sessionTimeout,
      twoFactorAuth,
    } = req.body;

    let settings = await Settings.findOne({ user: req.user.id });
    
    if (settings) {
      // Update existing settings
      settings.appName = appName || settings.appName;
      settings.themeColor = themeColor || settings.themeColor;
      settings.logo = logo || settings.logo;
      settings.companyName = companyName || settings.companyName;
      settings.companyAddress = companyAddress || settings.companyAddress;
      settings.companyPhone = companyPhone || settings.companyPhone;
      settings.companyEmail = companyEmail || settings.companyEmail;
      settings.fontFamily = fontFamily || settings.fontFamily;
      settings.fontSize = fontSize || settings.fontSize;
      settings.borderRadius = borderRadius || settings.borderRadius;
      settings.darkMode = darkMode !== undefined ? darkMode : settings.darkMode;
      settings.enableNotifications = enableNotifications !== undefined ? enableNotifications : settings.enableNotifications;
      settings.enableEmailAlerts = enableEmailAlerts !== undefined ? enableEmailAlerts : settings.enableEmailAlerts;
      settings.autoSave = autoSave !== undefined ? autoSave : settings.autoSave;
      settings.language = language || settings.language;
      settings.currency = currency || settings.currency;
      settings.taxRate = taxRate !== undefined ? taxRate : settings.taxRate;
      settings.invoiceTerms = invoiceTerms || settings.invoiceTerms;
      settings.sessionTimeout = sessionTimeout || settings.sessionTimeout;
      settings.twoFactorAuth = twoFactorAuth !== undefined ? twoFactorAuth : settings.twoFactorAuth;

      await settings.save();
    } else {
      // Create new settings
      settings = new Settings({
        user: req.user.id,
        appName,
        themeColor,
        logo,
        companyName,
        companyAddress,
        companyPhone,
        companyEmail,
        fontFamily,
        fontSize,
        borderRadius,
        darkMode,
        enableNotifications,
        enableEmailAlerts,
        autoSave,
        language,
        currency,
        taxRate,
        invoiceTerms,
        sessionTimeout,
        twoFactorAuth,
      });
      await settings.save();
    }
    
    res.json({
      message: "Settings saved successfully",
      settings
    });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

export default router;