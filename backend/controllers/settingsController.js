// controllers/settingsController.js
import Settings from "../models/Settings.js";
import fs from 'fs';
import path from 'path';

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const logoPath = req.file.filename;
    const userId = req.user.id;

    // Find existing settings or create new
    let settings = await Settings.findOne({ user: userId });
    
    if (settings) {
      // Delete old logo file if exists
      if (settings.logo) {
        const oldLogoPath = path.join('uploads', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo = logoPath;
    } else {
      settings = new Settings({
        user: userId,
        logo: logoPath
      });
    }

    await settings.save();

    res.json({
      message: "Logo uploaded successfully",
      logo: logoPath,
      logoUrl: `/uploads/${logoPath}`
    });

  } catch (error) {
    console.error("Logo upload error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

export const getLogo = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user.id });
    
    if (!settings || !settings.logo) {
      return res.status(404).json({ error: "Logo not found" });
    }

    res.json({ 
      logo: settings.logo,
      logoUrl: `/uploads/${settings.logo}`
    });
  } catch (error) {
    console.error("Get logo error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};