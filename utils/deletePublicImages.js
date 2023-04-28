const fs = require("fs");

const logger = require("../utils/loggers/winston-logger");

module.exports = async () => {
  try {
    await fs.rmdirSync("../public/images", { recursive: true });
    logger.log({
      level: "info",
      message: "All images in public folder has been deleted",
      label: "public folder",
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
      label: "error",
    });
  }
};
