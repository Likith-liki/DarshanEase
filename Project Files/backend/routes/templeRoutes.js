const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getAllTemples,
  getTempleById,
  getMyTemple,
  updateMyTemple,
  createTemple,
  updateTemple,
  deleteTemple,
  toggleBlockTemple,
} = require("../controllers/templeController");

// Public
router.get("/", getAllTemples);

// Organizer (must come before /:id to avoid route clash)
router.get("/my/temple", protect, authorize("organizer"), getMyTemple);
router.put(
  "/my/temple",
  protect,
  authorize("organizer"),
  upload.single("image"),
  updateMyTemple,
);

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createTemple,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateTemple,
);
router.delete("/:id", protect, authorize("admin"), deleteTemple);
router.patch("/:id/block", protect, authorize("admin"), toggleBlockTemple);

// Public - by id (last, generic)
router.get("/:id", getTempleById);

module.exports = router;
