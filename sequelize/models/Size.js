const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Size = sequelize.define(
    "Size",
    {
      id: uuidPrimaryKey(),
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Sizes",
      defaultScope: {
        attributes: ["id", "width", "height"],
      },
    }
  );

  return Size;
};
