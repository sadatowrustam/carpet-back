const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Carpet = sequelize.define(
    "Carpet",
    {
      id: uuidPrimaryKey(),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(2200),
        allowNull: false,
      },
      preview: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "Carpets",
    }
  );

  return Carpet;
};
