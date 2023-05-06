const { models } = require("../../sequelize");
const { Image } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  deleteImageById: catchAsync(async (req, res) => {
    const id = req.params.id;

    const image = await Image.findOne({ where: { id } });

    if (!image) {
      return res.status(404).send({
        status: "Not found",
        code: 404,
        message: `Couldn't find image with id ${id}`,
      });
    }

    await Image.destroy({ where: { id } });

    res.send({
      code: 200,
      status: "success",
      message: `Successfully deleted image with id ${id}`,
    });
  }),
};
