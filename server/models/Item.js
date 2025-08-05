const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateLost: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('found', 'missing'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'resolved'),
    defaultValue: 'pending'
  },
  uploaderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Item;
