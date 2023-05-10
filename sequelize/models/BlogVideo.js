const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const BlogVideo = sequelize.define(
    "BlogVideo",
    {
      id: uuidPrimaryKey(),
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
          return JSON.parse(this.getDataValue("title"));
        }
      },
    },
    {
      tableName: "BlogVideos",
    }
  );

  return BlogVideo;
};
