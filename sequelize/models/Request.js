const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Request = sequelize.define(
    "Request",
    {
      id: uuidPrimaryKey(),
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Requests",
    }
  );

  return Request;
};
