const { models } = require("../../sequelize");
const AppError = require("../../utils/appError");
const { Color } = models;

const catchAsync = require("../../utils/catchAsync");

const { validateColor } = require("../../utils/validate");

module.exports = {
  createColor: catchAsync(async (req, res,next) => {
    let { name, hex } = req.body;

    name = JSON.stringify(name);

    await validateColor(name, hex,next);

    const color = await Color.create({ name, hex });

    res.send({
      status: "success",
      code: 200,
      dataName: "color",
      data: color,
      message: "Successfully created color",
    });
  }),

  getColors: catchAsync(async (req, res) => {
    const colors = await Color.findAll();

    res.send({
      status: "success",
      code: 200,
      dataName: "colors",
      data: colors,
    });
  }),
  getColor: catchAsync(async (req, res) => {
    const id = req.params.id;

    const color = await Color.findOne({ where: { id } });

    if (!color) {
      return next(new AppError("Color not found",404))
    }


    res.send({
      status: "success",
      code: 200,
      color,
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

    res.send({
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
     return res.send({
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

    return res.send({
      code: 200,
      status: "success",
      message: `Successfully deleted color with id ${id}`,
    });
  }),
};
