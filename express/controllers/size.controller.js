const { models } = require("../../sequelize");
const { Size } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

const { validateSize } = require("../../utils/validate");

module.exports = {
  createSize: catchAsync(async (req, res) => {
    const { width, height } = req.body;

    await validateSize(width, height);

    const size = await Size.create({ width, height });

    response(res, {
      status: "success",
      code: 200,
      dataName: "size",
      data: size,
      message: `Successfully created a size (${width} x ${height})`,
    });
  }),

  getSizes: catchAsync(async (req, res) => {
    const sizes = await Size.findAll();
    response(res, {
      status: "success",
      code: 200,
      dataName: "sizes",
      data: sizes,
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

    response(res, {
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
      response(res, {
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

    response(res, {
      code: 200,
      status: "success",
      message: `Successfully deleted size with id ${id}`,
    });
  }),
};
