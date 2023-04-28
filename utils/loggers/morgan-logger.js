const morgan = require("morgan");

const morganOptions =
  ":date[web] | HTTP :http-version | IP :remote-addr | User-agent :user-agent | :method :url :status | :response-time ms";

module.exports = { morgan, morganOptions };
