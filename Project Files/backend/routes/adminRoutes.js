// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getOrganizerDashboardStats,
  getRevenueStats, // ← Make sure this is imported
  getOrganizerRevenueStats, // ← Make sure this is imported
} = require("../controllers/adminController");

// Admin routes
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get("/revenue", protect, authorize("admin"), getRevenueStats);

// Organizer routes
router.get(
  "/organizer-dashboard",
  protect,
  authorize("organizer"),
  getOrganizerDashboardStats,
);
router.get(
  "/organizer-revenue",
  protect,
  authorize("organizer"),
  getOrganizerRevenueStats,
);

module.exports = router;
