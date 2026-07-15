const Temple = require("../models/Temple");
const Organizer = require("../models/Organizer");

const getAllTemples = async (req, res) => {
  const temples = await Temple.find({ isBlocked: false }).populate(
    "organizer",
    "name email",
  );
  res.json(temples);
};

const getTempleById = async (req, res) => {
  const temple = await Temple.findById(req.params.id).populate(
    "organizer",
    "name email",
  );
  if (!temple) return res.status(404).json({ message: "Temple not found" });
  res.json(temple);
};

// Organizer: get own temple
const getMyTemple = async (req, res) => {
  const temple = await Temple.findOne({ organizer: req.user.id });
  if (!temple)
    return res.status(404).json({ message: "No temple assigned yet" });
  res.json(temple);
};

// Organizer: update own temple
const updateMyTemple = async (req, res) => {
  try {
    const temple = await Temple.findOne({ organizer: req.user.id });
    if (!temple)
      return res.status(404).json({ message: "No temple assigned yet" });

    const {
      templeName,
      darshanStartTime,
      darshanEndTime,
      location,
      description,
    } = req.body;
    if (templeName) temple.templeName = templeName;
    if (darshanStartTime) temple.darshanStartTime = darshanStartTime;
    if (darshanEndTime) temple.darshanEndTime = darshanEndTime;
    if (location) temple.location = location;
    if (description) temple.description = description;
    if (req.file) temple.image = `/uploads/${req.file.filename}`;

    await temple.save();
    res.json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: create temple and assign to organizer
const createTemple = async (req, res) => {
  try {
    const {
      templeName,
      location,
      darshanStartTime,
      darshanEndTime,
      description,
      organizerId,
    } = req.body;
    const temple = await Temple.create({
      templeName,
      location,
      darshanStartTime,
      darshanEndTime,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      organizer: organizerId || null,
    });
    if (organizerId) {
      await Organizer.findByIdAndUpdate(organizerId, { temple: temple._id });
    }
    res.status(201).json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTemple = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const temple = await Temple.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTemple = async (req, res) => {
  await Temple.findByIdAndDelete(req.params.id);
  res.json({ message: "Temple deleted" });
};

const toggleBlockTemple = async (req, res) => {
  const temple = await Temple.findById(req.params.id);
  if (!temple) return res.status(404).json({ message: "Temple not found" });
  temple.isBlocked = !temple.isBlocked;
  await temple.save();
  res.json(temple);
};

module.exports = {
  getAllTemples,
  getTempleById,
  getMyTemple,
  updateMyTemple,
  createTemple,
  updateTemple,
  deleteTemple,
  toggleBlockTemple,
};
