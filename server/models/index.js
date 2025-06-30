const sequelize = require('../config/db');
const Item = require('./Item');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync({ alter: true }); // or { force: true } for dev reset
    console.log('Models synchronized...');
  } catch (error) {
    console.error('DB connection failed:', error);
  }
};

module.exports = { syncDatabase, Item };
