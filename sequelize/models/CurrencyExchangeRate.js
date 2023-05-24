const { DataTypes } = require("sequelize");
const uuidPrimaryKey = require("../../utils/uuidPrimaryKey");

module.exports = (sequelize) => {
  const CurrencyExchangeRate = sequelize.define(
    "CurrencyExchangeRate",
    {
      id: uuidPrimaryKey(),
      fromCurrencyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toCurrencyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
    },
    {
      tableName: "CurrencyExchangeRates",
    }
  );

  return CurrencyExchangeRate;
};
