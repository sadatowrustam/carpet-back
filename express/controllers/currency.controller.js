const { models } = require("../../sequelize");
const { Currency, CurrencyExchangeRate } = models;

const catchAsync = require("../../utils/catchAsync");

const createCurrencyExchangeRate = async (
  firstCurrencyId,
  secondCurrencyId
) => {
  await CurrencyExchangeRate.create({
    fromCurrencyId: firstCurrencyId,
    toCurrencyId: secondCurrencyId,
    exchangeRate: 1,
  });
  await CurrencyExchangeRate.create({
    fromCurrencyId: secondCurrencyId,
    toCurrencyId: firstCurrencyId,
    exchangeRate: 1,
  });
};

const getCurrencyExchangeRateById = async (id) => {
  return await CurrencyExchangeRate.findOne({
    where: {
      id,
    },
  });
};

const getRelatedCurrencyExchangeRateByIds = async (
  fromCurrencyId,
  toCurrencyId
) => {
  return await CurrencyExchangeRate.findOne({
    where: {
      fromCurrencyId: toCurrencyId,
      toCurrencyId: fromCurrencyId,
    },
  });
};

module.exports = {
  getCurrencies: catchAsync(async (req, res) => {
    const currencies = await Currency.findAll();

    res({
      status: "success",
      code: 200,
      dataName: "currencies",
      data: currencies,
    });
  }),

  createCurrency: catchAsync(async (req, res) => {
    const { code, sign } = req.body;

    const currency = await Currency.create({ code, sign });

    const currencies = await Currency.findAll();

    if (currencies.length === 2) {
      await createCurrencyExchangeRate(currencies[0].id, currency.id);
    } else if (currencies.length > 2) {
      let skip = false;

      for (let i = 0; i < currencies.length; i++) {
        skip = currencies[i].id === currency.id;
        if (!skip) {
          await createCurrencyExchangeRate(currencies[i].id, currency.id);
        }
      }
    }

    res({
      code: 200,
      status: "success",
      dataName: "currency",
      data: currency,
      message: "Successfully created currency",
    });
  }),

  deleteCurrency: catchAsync(async (req, res) => {
    const id = req.params.id;

    const existingCurrency = await Currency.findOne({ where: { id } });
    if (!existingCurrency) {
      throw new Error(`Couldn't find currency with id ${id}`);
    }

    const relatedRates = [];
    let rates;

    rates = await CurrencyExchangeRate.findAll({
      where: {
        fromCurrencyId: id,
      },
    });
    relatedRates.push(...rates);

    rates = await CurrencyExchangeRate.findAll({
      where: {
        toCurrencyId: id,
      },
    });
    relatedRates.push(...rates);

    await Currency.destroy({ where: { id } });

    res({
      status: "success",
      code: 200,
      message: `Successfully deleted currency with id ${id}`,
    });
  }),

  getRates: catchAsync(async (req, res) => {
    const rates = await CurrencyExchangeRate.findAll({
      include: [
        {
          model: Currency,
          as: "fromCurrency",
          attributes: ["id", "code", "sign"],
        },
        {
          model: Currency,
          as: "toCurrency",
          attributes: ["id", "code", "sign"],
        },
      ],
      attributes: ["id", "exchangeRate"],
    });

    console.log(rates)

    res({
      status: "success",
      code: 200,
      dataName: "rates",
      data: rates,
    });
  }),

  changeRate: catchAsync(async (req, res) => {
    const { id } = req.params;

    let { exchangeRate } = req.body;

    let currencyExchangeRate = await getCurrencyExchangeRateById(id);

    if (!currencyExchangeRate) {
      res({
        code: 404,
        status: "Not found",
        message: `Couldn't find rate with id ${id}`,
      });
    }

    const { fromCurrencyId, toCurrencyId } = currencyExchangeRate;

    await CurrencyExchangeRate.update(
      { exchangeRate },
      {
        where: {
          id,
        },
      }
    );

    let relatedCurrencyExchangeRate = await getRelatedCurrencyExchangeRateByIds(
      fromCurrencyId,
      toCurrencyId
    );

    const relatedExchangeRate = 1 / exchangeRate;

    await CurrencyExchangeRate.update(
      { exchangeRate: relatedExchangeRate },
      {
        where: {
          id: relatedCurrencyExchangeRate.id,
        },
      }
    );

    currencyExchangeRate = await getCurrencyExchangeRateById(id);

    relatedCurrencyExchangeRate = await getRelatedCurrencyExchangeRateByIds(
      fromCurrencyId,
      toCurrencyId
    );

    res({
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        rate: currencyExchangeRate.exchangeRate,
        relatedRate: relatedCurrencyExchangeRate.exchangeRate,
      },
      message: "Successfully changed rate",
    });
  }),
};
