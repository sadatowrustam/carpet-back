const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Banner = sequelize.define(
    "Banner",
    {
      id: uuidPrimaryKey(),
      title: {
        type: DataTypes.TEXT,
        get(){
          return JSON.parse(this.getDataValue("title"))
        }
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
