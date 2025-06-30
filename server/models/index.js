const sequelize = require('../config/db');
const Item = require('./Item');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connected!');
    await sequelize.sync({ alter: true }); // keep schema updated
    console.log(' Models synced!');
  } catch (error) {
    console.error(' Database sync failed:', error);
  }
};

module.exports = { syncDatabase, Item };
