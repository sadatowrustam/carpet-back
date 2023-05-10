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
      hooks:{
        beforeDestroy(record,options){
          fs.unlink("./public/videos/"+record.url,(err)=>{
            if(err) console.log(err)
          })
          console.log("image deleted successfully")
        }
      }
    },
    {
      tableName: "Videos",
    }
  );

  return Video;
};
