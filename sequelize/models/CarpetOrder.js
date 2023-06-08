const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const CarpetOrder = sequelize.define(
    "CarpetOrder",
    {
      id: uuidPrimaryKey(),
      carpetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sizeId:{
        type:DataTypes.UUID
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "CarpetOrders",
    }
  );

  return CarpetOrder;
};
