const { models } = require("../../sequelize");
const { Video } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  deleteVideo: catchAsync(async (req, res) => {
    const { id } = req.params;

    const video = await Video.findOne({ id });

    if (!video) {
      throw new Error(`Couldn't find video with id ${id}`);
    }

    await Video.destroy({ where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully deleted video with id ${id}`,
    });
  }),
};
