const bcrypt = require("bcryptjs");
const Organizer = require("../models/Organizer");

// Organizer: own profile
const getMyProfile = async (req, res) => {
  const organizer = await Organizer.findById(req.user.id)
    .select("-password")
    .populate("temple");
  if (!organizer)
    return res.status(404).json({ message: "Organizer not found" });
  res.json(organizer);
};

const updateMyProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }
    const organizer = await Organizer.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    res.json(organizer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: manage organizers
const getAllOrganizers = async (req, res) => {
  const organizers = await Organizer.find()
    .select("-password")
    .populate("temple");
  res.json(organizers);
};

const getOrganizerById = async (req, res) => {
  const organizer = await Organizer.findById(req.params.id)
    .select("-password")
    .populate("temple");
  if (!organizer)
    return res.status(404).json({ message: "Organizer not found" });
  res.json(organizer);
};

const createOrganizer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await Organizer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const organizer = await Organizer.create({
      name,
      email,
      password: hashed,
      phone,
    });
    res.status(201).json(organizer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOrganizer = async (req, res) => {
  await Organizer.findByIdAndDelete(req.params.id);
  res.json({ message: "Organizer deleted" });
};

const toggleBlockOrganizer = async (req, res) => {
  const organizer = await Organizer.findById(req.params.id);
  if (!organizer)
    return res.status(404).json({ message: "Organizer not found" });
  organizer.isBlocked = !organizer.isBlocked;
  await organizer.save();
  res.json(organizer);
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllOrganizers,
  getOrganizerById,
  createOrganizer,
  deleteOrganizer,
  toggleBlockOrganizer,
};
