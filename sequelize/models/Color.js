const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Color = sequelize.define(
    "Color",
    {
      id: uuidPrimaryKey(),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        get: function () {
          return JSON.parse(this.getDataValue("name"));
        },
      },
      hex: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Colors",

      defaultScope: {
        attributes: {
          exclude: ["updatedAt"],
        },
      },
    }
  );

  return Color;
};
