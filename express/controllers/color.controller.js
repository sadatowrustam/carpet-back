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
      data: color,
    });
  }),

  getColors: catchAsync(async (req, res) => {
    const colors = await Color.findAll({order:[["createdAt","DESC"]]});

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
    await Color.update({ name, hex }, { where: { id } });
    res.send({
      status: "success",
      code: 200,
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
     return res.status(404).send({
        status: "Not found",
        message: `Couldn't find a color with id ${id}`,
      });
    }

    await color.destroy()

    return res.send({
      code: 200,
      status: "success",
      message: `Successfully deleted color with id ${id}`,
    });
  }),
};
