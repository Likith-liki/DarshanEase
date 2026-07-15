const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getOrganizerBookings,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/", protect, authorize("user"), createBooking);
router.get("/my", protect, authorize("user"), getMyBookings);
router.put("/:id/cancel", protect, authorize("user"), cancelBooking);

router.get("/organizer", protect, authorize("organizer"), getOrganizerBookings);
router.get("/", protect, authorize("admin"), getAllBookings);

module.exports = router;
