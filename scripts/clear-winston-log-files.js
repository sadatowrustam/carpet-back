const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fs = require("fs");
const winstonLogFilesPath = `${__dirname}/../logs`;

const clearMorganLogFile = () => {
  const winstonLogFiles = fs.readdirSync(winstonLogFilesPath);
  for (const winstonLogFile of winstonLogFiles) {
    fs.writeFileSync(`${winstonLogFilesPath}/${winstonLogFile}`, "");
  }

  logger.log({
    level: "info",
    message: "Cleared up all winston log files successfully",
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
