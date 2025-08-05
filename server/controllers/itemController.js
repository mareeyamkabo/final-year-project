// server/controllers/itemController.js

const { Item } = require('../models');
const { User } = require('../models'); 



// Create new item
exports.createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      dateLost,
      type,
      status = 'pending' 
    } = req.body;

    const item = await Item.create({
      name,
      description,
      location,
      dateLost,
      type,
      status,
      uploaderId: req.user.id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Item creation failed:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    await item.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
