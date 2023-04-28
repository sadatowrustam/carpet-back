const { models } = require("../../sequelize");
const { Banner, Image, Video } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

const getFileExtension = require("../../utils/getFileExtension");

module.exports = {
  createBanner: catchAsync(async (req, res) => {
    const { title, type } = req.body;

    const file = req.file;
    const filePath = req.filePath;

    const fileExtension = getFileExtension(file.originalname);
    const allowedExtensions = ["png", "jpg", "mp4"];
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(
        `Invalid file extension (${fileExtension}). Allowed file extensions: ${allowedExtensions}`
      );
    }

    const imageExtensions = ["png", "jpg"];
    if (type === "image" && !imageExtensions.includes(fileExtension)) {
      throw new Error(
        `File extension and type do not match (${type} -> ${fileExtension})`
      );
    }

    const videoExtensions = ["mp4"];
    if (type === "video" && !videoExtensions.includes(fileExtension)) {
      throw new Error(
        `File extension and type do not match (${type} -> ${fileExtension})`
      );
    }

    if (!type) {
      throw new Error("Type is required");
    }
    if (!file || !filePath) {
      throw new Error("Video file is required");
    }

    const banner = await Banner.create({ title, type });

    const modelRef = {
      image: Image,
      video: Video,
    };

    modelRef[type].create({ url: filePath, bannerId: banner.id });

    response(res, {
      status: "success",
      code: 200,
      dataName: "banner",
      data: banner,
      message: "Successfully created a banner",
    });
  }),

  getBanners: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await Banner.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        banners: rows,
        count,
      },
    });
  }),

  deleteBannerById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const banner = await Banner.findOne({ where: { id } });

    if (!banner) {
      throw new Error(`Couldn't find banner with id ${id}`);
    }

    await Banner.destroy({ where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully deleted banner with id ${id}`,
    });
  }),
};
