const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  loginOrganizer,
  loginAdmin,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/organizer/login", loginOrganizer);
router.post("/admin/login", loginAdmin);

module.exports = router;
