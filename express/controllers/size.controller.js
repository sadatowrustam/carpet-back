const { models } = require("../../sequelize");
const { Size } = models;
const AppError=require(".././../utils/appError")

const catchAsync = require("../../utils/catchAsync");

const { validateSize } = require("../../utils/validate");

module.exports = {
  createSize: catchAsync(async (req, res,next) => {
    const { width, height } = req.body;

    const size = await Size.create({ width, height });

    res.send({
      status: "success",
      code: 200,
      data: size,
      message: `Successfully created a size (${width} x ${height})`,
    });
  }),

  getSizes: catchAsync(async (req, res) => {
    const sizes = await Size.findAll();
    res.send({
      status: "success",
      code: 200,
      dataName: "sizes",
      data: sizes,
    });
  }),
  getSize: catchAsync(async (req, res,next) => {
    const { id } = req.params;

    const size = await Size.findOne({ where: { id } });

    if (!size) {
      return next(new AppError("Size not found",404))
    }

    res.send({
      status: "success",
      code: 200,
      size,
    });
  }),
  changeSize: catchAsync(async (req, res) => {
    const { id } = req.params;

    const size = await Size.findOne({ where: { id } });

    if (!size) {
      throw new Error(`Couldn't find size with id ${id}`);
    }

    const { width, height } = req.body;

    await validateSize(width, height);

    await Size.update({ width, height }, { where: { id } });

    res.send({
      status: "success",
      code: 200,
      message: `Successfully change size with id ${id}`,
    });
  }),

  deleteSize: catchAsync(async (req, res) => {
    const { id } = req.params;

    const size = await Size.findOne({
      where: {
        id,
      },
    });

    if (!size) {
      res.send({
        code: 404,
        status: "Not found",
        message: `Couldn't find a size with id ${id}`,
      });
    }

    await Size.destroy({
      where: {
        id,
      },
    });

    res.send({
      code: 200,
      status: "success",
      message: `Successfully deleted size with id ${id}`,
    });
  }),
};
