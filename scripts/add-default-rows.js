require("dotenv").config({
  path:"../config/config.env"

})
console.log(process.env)
const axios = require("axios");
axios.defaults.baseURL = process.env.HOST + ":" + process.env.PORT;

const sequelize = require("../sequelize");

const logger = require("../utils/loggers/winston-logger");

const bcrypt = require("bcrypt");

const addDefaultCurrency = async () => {
  try {
    const { models } = sequelize;
    const { Currency } = models;

    await axios.post("/currencies", { code: "USD", sign: "$" });
    await axios.post("/currencies", { code: "KZT", sign: "₸" });
  } catch (err) {
    console.log(err);
  }
};

const addDefaultSuperAdmin = async () => {
  try {
    const { models } = sequelize;
    const { Admin } = models;

    const password = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    let admin=await Admin.create({
      username: process.env.SUPERADMIN_USERNAME,
      password,
      role: "superAdmin",
    });
    console.log(admin)
  } catch (err) {
    console.log(err)
  }
};

(async () => {
  await addDefaultCurrency();
  await addDefaultSuperAdmin();
  logger.log({
    level: "info",
    message: "Created default currency and admin",
    label: "database",
  });
  process.exit();
})();
