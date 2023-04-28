const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const winstonLogFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), winstonLogFormat, format.colorize()),
  transports: [new transports.Console()],
});

module.exports = logger;
