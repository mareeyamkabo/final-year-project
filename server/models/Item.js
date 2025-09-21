// server/models/Item.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Item = sequelize.define("Item", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    dateLost: { type: DataTypes.DATE, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    image: { type: DataTypes.STRING, allowNull: true },
    category: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      defaultValue: "general"   //  Default for old records
    },
  });

  return Item;
};
