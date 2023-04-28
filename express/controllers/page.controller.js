const { models } = require("../../sequelize");
const { Currency, Color, Size, Material } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  getAddCarpetInfo: catchAsync(async (req, res) => {
    const currencies = await Currency.findAll();
    const colors = await Color.findAll();
    const sizes = await Size.findAll();
    const materials = await Material.findAll();

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        currencies,
        colors,
        sizes,
        materials,
      },
    });
  }),
};
