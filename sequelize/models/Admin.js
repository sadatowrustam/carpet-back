const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: uuidPrimaryKey(),
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
          len: [3, 25],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "moderator",
      },
      permissions: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      tableName: "Admins",
    }
  );

  return Admin;
};
