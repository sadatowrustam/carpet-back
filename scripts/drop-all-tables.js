const sequelize = require("../sequelize");

const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const deleteAllTables = async () => {
  try {
    await sequelize.drop();
    logger.log({
      level: "info",
      message: "Database tables has been deleted",
      label: "database",
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
      label: "error",
    });
  }
};

const deletePublicImages = require("../utils/deletePublicImages");

rl.question(
  'Are you sure you want to delete database tables? Type: "YES" if you are sure or press any other value to quit: ',
  async (answer) => {
    if (answer === "YES") {
      await deleteAllTables();
      await deletePublicImages();
      process.exit();
    } else {
      rl.close();
    }
  }
);
