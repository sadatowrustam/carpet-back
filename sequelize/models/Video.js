const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Video = sequelize.define(
    "Video",
    {
      id: uuidPrimaryKey(),
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Videos",
    }
  );

  return Video;
};
