const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

router.get("/me", protect, authorize("user"), getMyProfile);
router.put("/me", protect, authorize("user"), updateMyProfile);

// Admin-only
router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
