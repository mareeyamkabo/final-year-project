// server/controllers/itemController.js
const { Item, User } = require("../models");

// =============================
// Create new item
// =============================
exports.createItem = async (req, res) => {
  try {
    const { name, description, location, dateLost, type, status, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized - no user info" });
    }

    const newItem = await Item.create({
      name,
      description,
      location,
      dateLost,
      type,
      category, 
      status: status || "pending",
      image,
      uploaderId: req.userId,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ message: "Error creating item" });
  }
};


// =============================
// Search items by name, location, or description
// =============================
exports.searchItems = async (req, res) => {
  try {
    const { q } = req.query; // e.g. /api/items/search?q=wallet
    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const items = await Item.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { name: { [require("sequelize").Op.like]: `%${q}%` } },
          { description: { [require("sequelize").Op.like]: `%${q}%` } },
          { location: { [require("sequelize").Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (err) {
    console.error("❌ Error searching items:", err);
    res.status(500).json({ message: "Error searching items" });
  }
};



// =============================
// Get all items
// =============================
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
};

// =============================
// Update item (admin only)
// =============================
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      console.warn(`🚨 Update failed: Item ${id} not found`);
      return res.status(404).json({ message: "Item not found" });
    }

    if (req.file) req.body.image = req.file.filename;

    await item.update(req.body);

    console.log(`✅ Item ${id} updated by admin ${req.userId}`);
    res.json(item);
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ message: "Error updating item" });
  }
};

// =============================
// Delete item (admin only)
// =============================
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      console.warn(`🚨 Delete failed: Item ${id} not found`);
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();

    console.log(`✅ Item ${id} deleted by admin ${req.userId}`);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
};
