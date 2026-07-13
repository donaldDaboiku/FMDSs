import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/designers", protect, async (req, res) => {
  res.json({ message: "Designers list" });
});

router.post("/designers", protect, adminOnly, async (req, res) => {
  res.json({ message: "Designer created" });
});

export default router;
