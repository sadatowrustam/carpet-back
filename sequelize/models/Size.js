const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Size = sequelize.define(
    "Size",
    {
      id: uuidPrimaryKey(),
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price:{
        type:DataTypes.INTEGER,
        get(){
          const carpetSize=this.getDataValue("carpetSize")
          if(carpetSize){
            if(carpetSize.discount>0) {return (carpetSize.price-(carpetSize.price*carpetSize.discount/100))}
            else { return carpetSize.price}
          }
        }
      }
    },
    {
      tableName: "Sizes",
      defaultScope: {
        attributes: ["id", "width", "height"],
      },
    }
  );

  return Size;
};
