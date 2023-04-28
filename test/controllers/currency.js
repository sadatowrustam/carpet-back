const axios = require("../test-helpers/axios");

const currencyTemplate = {
  code: "USD",
  sign: "$",
};

const relatedCurrencyTemplate = {
  code: "TMT",
  sign: "TMT",
};

const exchangeDataTemplate = {
  exchangeId: 1,
  exchangeRate: 3.5,
};

module.exports = () => {
  describe("Currency controller", () => {
    it("Create a currency", async () => {
      const { data } = await axios.post("/currencies", currencyTemplate);
      const { code, currency } = data;

      expect(code).toBe(200);
      expect(currency).toBeInstanceOf(Object);
      expect(currency.code).toBe(currencyTemplate.code);
      expect(currency.sign).toBe(currencyTemplate.sign);
    });

    it("Add one more currency", async () => {
      const { data } = await axios.post("/currencies", relatedCurrencyTemplate);
      const { code, currency } = data;

      expect(code).toBe(200);
      expect(currency).toBeInstanceOf(Object);
      expect(currency.code).toBe(relatedCurrencyTemplate.code);
      expect(currency.sign).toBe(relatedCurrencyTemplate.sign);
    });

    it("Change rates of two currencies", async () => {
      let { data } = await axios.patch(
        "/currencies/rates",
        exchangeDataTemplate
      );
      const { code } = data;
      const { rate, relatedRate } = data.data;

      expect(code).toBe(200);
      expect(data).toBeInstanceOf(Object);
      expect(rate).toBe("3.5000000000");
      expect(relatedRate).toBe("0.2857142857");
    });
  });
};
