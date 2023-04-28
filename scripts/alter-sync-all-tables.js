const sequelize = require("../sequelize");

const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const updateAllTables = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.log({
      level: "info",
      message: "Database tables has been alter synced",
      label: "database",
    });
    process.exit();
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
      label: "error",
    });
  }
};

rl.question(
  'Are you sure you want to alter update database tables? Type: "YES" if you are sure or press any other value to quit: ',
  async (answer) => {
    if (answer === "YES") {
      await updateAllTables();
    } else {
      rl.close();
    }
  }
);
