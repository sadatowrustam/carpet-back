const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");
const fs=require("fs")
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
      hooks:{
        beforeDestroy(record,options){
          fs.unlink("./public/images/"+record.url,(err)=>{
            if(err) console.log(err)
          })
          console.log("image deleted successfully")
        }
      }
    },
    {
      tableName: "Images",
    }
  );
  return Image;
};
