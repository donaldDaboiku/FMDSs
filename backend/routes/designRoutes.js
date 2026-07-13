import express from "express";
import { 
  createDesign, 
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign 
} from "../controllers/designController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDesign);
router.get("/", protect, getDesigns);
router.get("/:id", protect, getDesignById);
router.put("/:id", protect, updateDesign);
router.delete("/:id", protect, deleteDesign);

export default router;