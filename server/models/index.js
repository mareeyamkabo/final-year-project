const sequelize = require('../config/db');
const User = require('./User');
const Item = require('./Item');

// Relations
User.hasMany(Item, { foreignKey: 'uploaderId' });
Item.belongsTo(User, { foreignKey: 'uploaderId' });

module.exports = { sequelize, User, Item };
