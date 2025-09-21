const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const claimController = require("../controllers/claimController");

// Submit a claim
router.post("/", verifyToken, claimController.createClaim);

// ✅ Get logged-in student's claims
router.get("/", verifyToken, claimController.getMyClaims);

module.exports = router;
