// server/controllers/itemController.js

const { Item, User } = require('../models');

/**
 * Create a new lost/found item
 * Requires authentication (verifyToken)
 * uploaderId is taken from req.user.id (logged-in user)
 */
exports.createItem = async (req, res) => {
  try {
    const { name, description, location, dateLost, type, status } = req.body;

    // Validate required fields
    if (!name || !description || !location || !dateLost || !type) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const newItem = await Item.create({
      name,
      description,
      location,
      dateLost,
      type,
      status: status || 'pending', // Default status if not provided
      uploaderId: req.user.id // ✅ comes from verifyToken
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

/**
 * Get all items (admin & authenticated users)
 * Includes uploader details
 */
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

/**
 * Update an item (admin only)
 * Can be used to change details or status
 */
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Merge updates (only provided fields will be updated)
    const updates = {
      name: req.body.name ?? item.name,
      description: req.body.description ?? item.description,
      location: req.body.location ?? item.location,
      dateLost: req.body.dateLost ?? item.dateLost,
      type: req.body.type ?? item.type,
      status: req.body.status ?? item.status
    };

    await item.update(updates);

    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

/**
 * Delete an item (admin only)
 */
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
