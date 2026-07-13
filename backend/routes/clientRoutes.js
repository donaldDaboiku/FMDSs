import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createClient,
  getClients,
  getClientById,
  updateClient
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/", protect, createClient);
router.get("/", protect, getClients);
router.get("/:id", protect, getClientById);
router.put("/:id", protect, updateClient);

export default router;
