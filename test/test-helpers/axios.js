require("dotenv").config({
  path: "config/config.env",
});

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

const axios = require("axios");
axios.defaults.baseURL = `${HOST}:${PORT}`;

module.exports = axios;
