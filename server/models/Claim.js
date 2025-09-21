// server/models/Claim.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Claim = sequelize.define("Claim", {
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  });

  Claim.associate = (models) => {
    Claim.belongsTo(models.User, { foreignKey: "userId", as: "student" });
    Claim.belongsTo(models.Item, { foreignKey: "itemId", as: "item" });
  };

  return Claim;
};
