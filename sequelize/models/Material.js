const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Material = sequelize.define(
    "Material",
    {
      id: uuidPrimaryKey(),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Materials",
      defaultScope: {
        attributes: ["id", "name"],
      },
    }
  );

  return Material;
};
