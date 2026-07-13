import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import designerRoutes from "./routes/designerRoutes.js";
import designRoutes from "./routes/designRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { protect, adminOnly, role } from "./middleware/authMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoute.js";
import clientRoutes from "./routes/clientRoutes.js";
import Order from "./models/Order.js";
import Design from "./models/Design.js";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs"; 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Routes
app.use("/api/designer", designerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/designers", designerRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/settings", settingsRoutes);


// Auth test routes - USING protect FROM THE COMBINED IMPORT
app.get("/protected-route", protect, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

app.get("/admin-route", protect, adminOnly, (req, res) => {
  res.json({ message: "You have accessed an admin-only route!", user: req.user });
});

// Create Order
app.post("/orders", protect, async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all orders
app.get("/orders", protect, async (req, res) => {
  const orders = await Order.find().populate("clientId").populate("designId").populate("staffId");
  res.json(orders);
});

// Update order
app.put("/orders/:id", protect, async (req, res) => {
  const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete order
app.delete("/orders/:id", protect, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order removed" });
});

// Create design — designer or admin only
app.post("/designs", protect, role(["designer", "admin"]), async (req, res) => {
  const design = await Design.create({ ...req.body, ownerId: req.user.id });
  res.json(design);
});

// Get all designs
app.get("/designs", protect, async (req, res) => {
  const designs = await Design.find();
  res.json(designs);
});

// Update design
app.put("/designs/:id", protect, role(["designer", "admin"]), async (req, res) => {
  const d = await Design.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(d);
});

// Delete design
app.delete("/designs/:id", protect, role(["designer", "admin"]), async (req, res) => {
  await Design.findByIdAndDelete(req.params.id);
  res.json({ message: "Design removed" });
});

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fmds')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
// Add this temporary route to your server.js (remove after testing)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});