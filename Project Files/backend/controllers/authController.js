const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organizer = require("../models/Organizer");
const Admin = require("../models/Admin");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "darshanease_super_secret_key_change_this",
    {
      expiresIn: "7d",
    },
  );
};

// @desc Register a new devotee (user)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      address,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
      token: generateToken(user._id, "user"),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login devotee (user)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "user",
      token: generateToken(user._id, "user"),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login organizer
const loginOrganizer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const organizer = await Organizer.findOne({ email });
    if (!organizer)
      return res.status(400).json({ message: "Invalid email or password" });
    if (organizer.isBlocked)
      return res.status(403).json({ message: "Your account has been blocked" });

    const match = await bcrypt.compare(password, organizer.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
      role: "organizer",
      temple: organizer.temple,
      token: generateToken(organizer._id, "organizer"),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
      token: generateToken(admin._id, "admin"),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a default admin account on server startup if none exists,
// so there's always a way into the admin dashboard.
const ensureDefaultAdmin = async () => {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@darshanease.com";
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
    const existing = await Admin.findOne({ email });
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      await Admin.create({ name: "Admin", email, password: hashed });
      console.log(`✅ Default admin created: ${email} / ${password}`);
    }
  } catch (err) {
    console.log("Could not ensure default admin:", err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginOrganizer,
  loginAdmin,
  ensureDefaultAdmin,
};
