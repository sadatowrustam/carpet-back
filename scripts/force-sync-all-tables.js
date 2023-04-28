const sequelize = require("../sequelize");

const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const syncAllTables = async () => {
  try {
    await sequelize.sync({ force: true });
    logger.log({
      level: "info",
      message: "Database tables has been force synced",
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

rl.question(
  'Are you sure you want to force update database tables? It can delete all your data in database. Type: "YES" if you are sure or press any other value to quit: ',
  async (answer) => {
    if (answer === "YES") {
      await syncAllTables();
      process.exit();
    } else {
      rl.close();
    }
  }
);
