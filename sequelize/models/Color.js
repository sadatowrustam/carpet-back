const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const Color = sequelize.define(
    "Color",
    {
      id: uuidPrimaryKey(),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hex: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isHEXFormat(value) {
            const HEXRegex = new RegExp(/^#[0-9a-f]{3,6}$/i);

            if (!value.match(HEXRegex)) {
              throw new Error(
                "Color value must be in hexadecimal format (#xxxxxx) or (#xxx)"
              );
            }
          },
        },
      },
    },
    {
      tableName: "Colors",

      defaultScope: {
        attributes: {
          exclude: ["updatedAt"],
        },
      },
    }
  );

  return Color;
};
