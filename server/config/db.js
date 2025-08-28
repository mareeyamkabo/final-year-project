// server/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: console.log, 
  }
);

// ✅ Test the connection immediately
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully.');
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

module.exports = sequelize;
