// server/models/index.js
const sequelize = require('../config/db');

// Import model definitions
const User = require('./User')(sequelize);
const Item = require('./Item')(sequelize);

// Define relations
User.hasMany(Item, { as: 'items', foreignKey: 'uploaderId' });
Item.belongsTo(User, { as: 'uploader', foreignKey: 'uploaderId' });

module.exports = { sequelize, User, Item };
