const Darshan = require("../models/Darshan");
const Temple = require("../models/Temple");

const getDarshansByTemple = async (req, res) => {
  const darshans = await Darshan.find({ temple: req.params.templeId });
  res.json(darshans);
};

const getDarshanById = async (req, res) => {
  const darshan = await Darshan.findById(req.params.id).populate("temple");
  if (!darshan) return res.status(404).json({ message: "Darshan not found" });
  res.json(darshan);
};

// Organizer: own darshans
const getMyDarshans = async (req, res) => {
  const temple = await Temple.findOne({ organizer: req.user.id });
  if (!temple) return res.json([]);
  const darshans = await Darshan.find({ temple: temple._id });
  res.json(darshans);
};

const createDarshan = async (req, res) => {
  try {
    const temple = await Temple.findOne({ organizer: req.user.id });
    if (!temple)
      return res
        .status(400)
        .json({ message: "You must have a temple assigned first" });

    const {
      darshanName,
      startTime,
      endTime,
      normalPrice,
      vipPrice,
      description,
      availableSeats,
    } = req.body;
    const darshan = await Darshan.create({
      darshanName,
      temple: temple._id,
      startTime,
      endTime,
      normalPrice,
      vipPrice,
      description,
      availableSeats,
    });
    res.status(201).json(darshan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDarshan = async (req, res) => {
  try {
    const darshan = await Darshan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(darshan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDarshan = async (req, res) => {
  await Darshan.findByIdAndDelete(req.params.id);
  res.json({ message: "Darshan deleted" });
};

module.exports = {
  getDarshansByTemple,
  getDarshanById,
  getMyDarshans,
  createDarshan,
  updateDarshan,
  deleteDarshan,
};
