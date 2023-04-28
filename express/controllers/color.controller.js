const { models } = require("../../sequelize");
const { Color } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

const { validateColor } = require("../../utils/validate");

module.exports = {
  createColor: catchAsync(async (req, res) => {
    let { name, hex } = req.body;

    name = JSON.stringify(name);

    await validateColor(name, hex);

    const color = await Color.create({ name, hex });

    response(res, {
      status: "success",
      code: 200,
      dataName: "color",
      data: color,
      message: "Successfully created color",
    });
  }),

  getColors: catchAsync(async (req, res) => {
    const colors = await Color.findAll();

    response(res, {
      status: "success",
      code: 200,
      dataName: "colors",
      data: colors,
    });
  }),

  changeColor: catchAsync(async (req, res) => {
    const id = req.params.id;

    const color = await Color.findOne({ where: { id } });

    if (!color) {
      throw new Error(`Color with id ${id} doesn't exist`);
    }

    const { name, hex } = req.body;

    await validateColor(name, hex);

    await Color.update({ name, hex }, { where: { id } });

    response(res, {
      status: "success",
      code: 200,
      dataName: "updatedColor",
      data: color,
      message: "Successfully changed color",
    });
  }),

  deleteColor: catchAsync(async (req, res) => {
    const { id } = req.params;

    const color = await Color.findOne({
      where: {
        id,
      },
    });

    if (!color) {
      response(res, {
        code: 404,
        status: "Not found",
        message: `Couldn't find a color with id ${id}`,
      });
    }

    await Color.destroy({
      where: {
        id,
      },
    });

    response(res, {
      code: 200,
      status: "success",
      dataName: "colorId",
      data: id,
      message: `Successfully deleted color with id ${id}`,
    });
  }),
};
