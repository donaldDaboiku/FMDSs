import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, rple = 'user'} = req.body;
    
    // Check if user already exists
    const existingUser  = await User.findOne ({ email });
    if (existingUser) {
        return res.status(400).json({ erro: "User already exists"});
    }
    // Crreate new user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Generate token
    const token =  user.generateAuthToken();

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
    } catch(error){
    res.status(500).json({ error: error.message })
    }
}); 
 
// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ error: "Account is deactivated" });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || "fallback_secret_key",
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get("/me", protect, async (req, res) => {
    res.json({
        id: req.user._id.toString(),
        name: req.uesr.name,
        email: req.user.email,
        role: req.user.role
    });
});

export default router;
