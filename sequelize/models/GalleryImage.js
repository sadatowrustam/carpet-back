const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const GalleryImage = sequelize.define(
    "GalleryImage",
    {
      id: uuidPrimaryKey(),
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "GalleryImages",
    }
  );

  return GalleryImage;
};
