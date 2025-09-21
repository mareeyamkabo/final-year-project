const { Claim, Item } = require("../models");

// Create a claim
exports.createClaim = async (req, res) => {
  try {
    const { itemId, reason } = req.body;

    const claim = await Claim.create({
      userId: req.userId, // from auth middleware
      itemId,
      reason,
    });

    res.status(201).json(claim);
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ message: "Failed to submit claim" });
  }
};

// Get all claims for the logged-in student
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "description", "image", "location"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(claims);
  } catch (err) {
    console.error("❌ Error fetching claims:", err);
    res.status(500).json({ message: "Failed to fetch claims" });
  }
};
