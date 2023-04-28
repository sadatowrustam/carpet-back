const axios = require("../test-helpers/axios");

const colorTemplate = {
  id: null,
  name: "white",
  hex: "#fff",
};

module.exports = () => {
  describe("Color controller", () => {
    it("Getting all colors", async () => {
      const { data } = await axios.get("/colors");
      const colors = data.colors;

      expect(colors).not.toBeNull();
    });

    it("Create color", async () => {
      const { data } = await axios.post("/colors", colorTemplate);
      const { code, color } = data;

      colorTemplate.id = color.id;

      expect(code).toBe(200);
      expect(color).toBeInstanceOf(Object);
      expect(color.name).toBe(colorTemplate.name);
      expect(color.hex).toBe(colorTemplate.code);
    });

    it("Delete color", async () => {
      const { data } = await axios.delete(`/colors/${colorTemplate.id}`);
      const { code, colorId } = data;

      expect(code).toBe(200);
      expect(colorId).toBe(colorTemplate.id);
    });
  });
};
