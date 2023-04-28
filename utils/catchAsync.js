const logger = require("./loggers/winston-logger");

const response = require("./response");

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      logger.log({
        level: "error",
        message: err,
        label: "error",
      });
      response(res, { status: "error", code: 500, message: err.message });
      next();
    });
  };
};
