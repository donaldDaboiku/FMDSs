import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createItem, getItems, updateStock } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.put("/:id", protect, updateStock);

export default router;
