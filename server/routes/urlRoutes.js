const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  createShortUrl,
  getMyUrls,
  deleteUrl,
  getClickStats,
} = require("../controllers/urlController");

router.post("/shorten", verifyToken, createShortUrl);
router.get("/my", verifyToken, getMyUrls);
router.delete("/:id", verifyToken, deleteUrl);
router.get("/:shortCode/stats", verifyToken, getClickStats);

module.exports = router;
