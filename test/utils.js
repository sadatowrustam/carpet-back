const axios = require("./test-helpers/axios");

const logger = require("../utils/loggers/winston-logger");

const readFileLines = require("../utils/readFileLines");

module.exports = () => {
  describe("Loggers", () => {
    it("Winston logger", async () => {
      const winstonLogFileLinesBefore = await readFileLines(
        "logs/winston-info-logs.log"
      );
      const loggedMessage = logger.log({
        level: "info",
        message: "Testing winston logger",
        label: "test",
      });
      expect(loggedMessage).not.toBeNull();
      expect(loggedMessage.level).toBe("info");

      const winstonLogFileLinesAfter = await readFileLines(
        "logs/winston-info-logs.log"
      );
      expect(winstonLogFileLinesAfter).toBe(winstonLogFileLinesBefore + 1);
    });

    it("Morgan logger", async () => {
      const morganLogFileLinesBefore = await readFileLines(
        "logs/morgan-logs.log"
      );
      const { data } = await axios.get(`/carpets`);
      expect(data).not.toBeNull();

      const morganLogFileLinesAfter = await readFileLines(
        "logs/morgan-logs.log"
      );
      expect(morganLogFileLinesAfter).toBe(morganLogFileLinesBefore + 1);
    });
  });
};
