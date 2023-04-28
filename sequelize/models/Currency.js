const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Currency = sequelize.define(
    "Currency",
    {
      id: uuidPrimaryKey(),
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      sign: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Currencies",
      defaultScope: {
        attributes: ["id", "code", "sign"],
      },
    }
  );

  return Currency;
};
