const sequelize = require('../config/db');

// Import model definitions
const User = require('./User')(sequelize);
const Item = require('./Item')(sequelize);
const Claim = require('./Claim')(sequelize); 
// Define relations
User.hasMany(Item, { as: 'items', foreignKey: 'uploaderId' });
Item.belongsTo(User, { as: 'uploader', foreignKey: 'uploaderId' });

// ✅ Claim relations
User.hasMany(Claim, { foreignKey: 'userId' });
Claim.belongsTo(User, { as: 'student', foreignKey: 'userId' });

Item.hasMany(Claim, { foreignKey: 'itemId' });
Claim.belongsTo(Item, { as: 'item', foreignKey: 'itemId' });

module.exports = { sequelize, User, Item, Claim };
