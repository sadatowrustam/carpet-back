const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Banner = sequelize.define(
    "Banner",
    {
      id: uuidPrimaryKey(),
      title: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Banners",
    }
  );

  return Banner;
};
