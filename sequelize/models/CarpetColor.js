const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const CarpetColor = sequelize.define(
    "CarpetColor",
    {
      id: uuidPrimaryKey(),
      carpetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      colorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "CarpetColors",
    }
  );

  return CarpetColor;
};
