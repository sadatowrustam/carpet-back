const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const CarpetSize = sequelize.define(
    "CarpetSize",
    {
      id: uuidPrimaryKey(),
      carpetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sizeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      
      inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "CarpetSizes",
    }
  );

  return CarpetSize;
};
