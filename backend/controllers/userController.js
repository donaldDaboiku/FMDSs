import User from "../models/User.js";
import bcrypt from "bcryptjs";

// -----------------------------
// REGISTER USER
// -----------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user"
    });

    res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// LOGIN USER
// -----------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken();

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// ADMIN: GET ALL USERS
// -----------------------------
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// -----------------------------
// ADMIN: GET USER BY ID
// -----------------------------
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// -----------------------------
// ADMIN: CREATE USER
// -----------------------------
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email exists" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    res.json({
      message: "User created",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// ADMIN: UPDATE USER
// -----------------------------
export const updateUser = async (req, res) => {
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-password");

  res.json({ message: "User updated", user });
};

// -----------------------------
// ADMIN: DELETE USER
// -----------------------------
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
