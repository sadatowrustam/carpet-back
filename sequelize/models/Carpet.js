const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Carpet = sequelize.define(
    "Carpet",
    {
      id: uuidPrimaryKey(),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
          return JSON.parse(this.getDataValue("name"));
        }
      },
      material: {
        type: DataTypes.TEXT,
        allowNull: false,
        get(){
          return JSON.parse(this.getDataValue("material"));
        }

      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        get(){
          return JSON.parse(this.getDataValue("description"));
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        get(){
          return JSON.parse(this.getDataValue("content"));
        }
      },
      preview: {
        type: DataTypes.TEXT,
      },
      isDiscount:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
      },
      prices:{
        type:DataTypes.ARRAY(DataTypes.INTEGER)
      },
    },
    {
      tableName: "Carpets",
    }
  );

  return Carpet;
};
