const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDarshansByTemple,
  getDarshanById,
  getMyDarshans,
  createDarshan,
  updateDarshan,
  deleteDarshan,
} = require("../controllers/darshanController");

// Organizer
router.get("/my/darshans", protect, authorize("organizer"), getMyDarshans);
router.post("/", protect, authorize("organizer"), createDarshan);
router.put("/:id", protect, authorize("organizer"), updateDarshan);
router.delete("/:id", protect, authorize("organizer"), deleteDarshan);

// Public
router.get("/temple/:templeId", getDarshansByTemple);
router.get("/:id", getDarshanById);

module.exports = router;
