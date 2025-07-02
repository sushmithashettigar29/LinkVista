const express = require("express");
const {
  registerUser,
  loginUser,
  getMyProfile,
} = require("../controllers/authController");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMyProfile);

module.exports = router;
