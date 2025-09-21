// server/models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z\s]+$/, // ✅ allows letters and spaces
          msg: "Name must contain only letters and spaces",
        },
      },
    },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    nin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    role: {
      type: DataTypes.ENUM("admin", "student"),
      defaultValue: "student",
    },
  });

  return User;
};
