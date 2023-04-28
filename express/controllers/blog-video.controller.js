const { models } = require("../../sequelize");
const { Video, BlogVideo } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  createBlogVideo: catchAsync(async (req, res) => {
    const videoFile = req.file;
    const videoPath = req.video;
    const { title } = req.body;

    const blogVideo = await BlogVideo.create({ title });
    const video = await Video.create({
      url: videoPath,
      blogVideoId: blogVideo.id,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "video",
      data: video,
      message: "Successfully created video",
    });
  }),

  getBlogVideos: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await BlogVideo.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        blogVideos: rows,
        count,
      },
    });
  }),

  deleteBlogVideoById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const blogVideo = await BlogVideo.findOne({ where: { id } });

    if (!blogVideo) {
      throw new Error(`Couldn't find blog video with id ${id}`);
    }

    await BlogVideo.destroy({ where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully deleted blog video with id ${id}`,
    });
  }),
};
