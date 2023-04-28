const axios = require("../test-helpers/axios");

const carpetTemplate = {
  name: "My Carpet",
  colorIds: [1],
};

module.exports = () => {
  describe("Carpet controller", () => {
    it("Getting all carpets", async () => {
      const { data } = await axios.get("/carpets");
      const { status, code, carpets } = data;

      expect(status).toBe("success");
      expect(code).toBe(200);
      expect(carpets).toBeInstanceOf(Object);
      expect(carpets).not.toBeNull();
    });

    it("Create one carpet", async () => {
      const { data } = await axios.post("/carpets", carpetTemplate);
      const { status, code, carpet, message } = data;

      expect(status).toBe("success");
      expect(code).toBe(200);
      expect(carpet).toBeInstanceOf(Object);
      expect(carpet).not.toBeNull();
      expect(message).toBe("Successfully created a carpet");
    });
  });
};
