const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fs = require("fs");
const morganFilePath = `${__dirname}/../logs/morgan-logs.log`;
const clearMorganLogFile = () => {
  fs.writeFileSync(morganFilePath, "");
  logger.log({
    level: "info",
    message: "Cleared up morgan log file successfully",
    label: "success",
  });
  process.exit();
};

rl.question(
  "Are you sure you want to delete morgan log files? Type 'YES' if you are sure or press any other value: ",
  () => {
    clearMorganLogFile();
  }
);
