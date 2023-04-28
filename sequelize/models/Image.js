const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Image = sequelize.define(
    "Image",
    {
      id: uuidPrimaryKey(),
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "Images",
    }
  );

  return Image;
};
