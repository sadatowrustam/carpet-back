const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const AdminToken = sequelize.define(
    "AdminToken",
    {
      id: uuidPrimaryKey(),
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "AdminTokens",
    }
  );

  return AdminToken;
};
