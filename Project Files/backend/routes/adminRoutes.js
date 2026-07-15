const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getOrganizerDashboardStats,
} = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get(
  "/organizer-dashboard",
  protect,
  authorize("organizer"),
  getOrganizerDashboardStats,
);

module.exports = router;
