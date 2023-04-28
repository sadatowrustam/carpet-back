const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  getCurrencies,
  createCurrency,
  getRates,
  changeRate,
  deleteCurrency,
} = require("../controllers/currency.controller");

router.get("/", getCurrencies);
router.post("/", createCurrency);
router.get("/rates", getRates);
router.patch("/rates/:id", adminMiddleware, changeRate);
router.delete("/:id", adminMiddleware, deleteCurrency);

module.exports = router;
