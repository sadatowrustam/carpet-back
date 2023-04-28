const { models } = require("../../sequelize");
const { Color, Size, Material } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  getAllFilters: catchAsync(async (req, res) => {
    const colors = await Color.findAll();
    const sizes = await Size.findAll({
      order: [
        ["width", "ASC"],
        ["height", "ASC"],
      ],
    });
    const materials = await Material.findAll();

    for (const color of colors) {
      color.name = JSON.parse(color.name);
    }

    for (const material of materials) {
      material.name = JSON.parse(material.name);
    }

    response(res, {
      status: "success",
      code: 200,
      dataName: "filters",
      data: {
        colors,
        sizes,
        materials,
      },
    });
  }),
};
