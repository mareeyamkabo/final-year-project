// server/routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const upload = require("../middleware/upload");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", itemController.getAllItems);

// Protected routes
router.post("/", verifyToken, upload.single("image"), itemController.createItem);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), itemController.updateItem);
router.delete("/:id", verifyToken, isAdmin, itemController.deleteItem);

module.exports = router;
