const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getAllOrganizers,
  getOrganizerById,
  createOrganizer,
  deleteOrganizer,
  toggleBlockOrganizer,
} = require("../controllers/organizerController");

// Organizer self
router.get("/me", protect, authorize("organizer"), getMyProfile);
router.put("/me", protect, authorize("organizer"), updateMyProfile);

// Admin manage organizers
router.get("/", protect, authorize("admin"), getAllOrganizers);
router.post("/", protect, authorize("admin"), createOrganizer);
router.get("/:id", protect, authorize("admin"), getOrganizerById);
router.delete("/:id", protect, authorize("admin"), deleteOrganizer);
router.patch("/:id/block", protect, authorize("admin"), toggleBlockOrganizer);

module.exports = router;
