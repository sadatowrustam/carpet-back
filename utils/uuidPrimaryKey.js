const { DataTypes } = require("sequelize");

module.exports = () => ({
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true,
});
