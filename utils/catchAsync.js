const logger = require("./loggers/winston-logger");

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      console.log(err)
      logger.log({
        level: "error",
        message: err,
        label: "error",
      });
      console.log("catch Async",req.originalUrl,req.method)
      return res.status(500).send({ status: "error", code: 500, message: err.message });
    });
  };
};
