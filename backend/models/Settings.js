import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  
  // App Branding
  appName: { type: String, default: "FMDS" },
  themeColor: { type: String, default: "#3f51b5" },
  logo: { type: String },
  
  // Company Information
  companyName: { type: String },
  companyAddress: { type: String },
  companyPhone: { type: String },
  companyEmail: { type: String },
  
  // Theme & UI
  fontFamily: { type: String, default: "Roboto" },
  fontSize: { type: String, default: "medium" },
  borderRadius: { type: String, default: "8px" },
  darkMode: { type: Boolean, default: false },
  
  // Features
  enableNotifications: { type: Boolean, default: true },
  enableEmailAlerts: { type: Boolean, default: true },
  autoSave: { type: Boolean, default: true },
  language: { type: String, default: "en" },
  
  // Business
  currency: { type: String, default: "USD" },
  taxRate: { type: Number, default: 0 },
  invoiceTerms: { type: String, default: "Net 30 days" },
  
  // Security
  sessionTimeout: { type: Number, default: 30 },
  twoFactorAuth: { type: Boolean, default: false },
  
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);