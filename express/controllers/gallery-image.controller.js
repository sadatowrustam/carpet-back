const { models } = require("../../sequelize");
const { GalleryImage, Image } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  createGalleryImage: catchAsync(async (req, res) => {
    const { title } = req.body;
    const image = req.image;
    const imageFile = req.file;

    if (!title) {
      throw new Error("Title is required");
    }
    if (!image) {
      throw new Error("Image is required");
    }

    const galleryImage = await GalleryImage.create({ title });

    await Image.create({ url: image, galleryImageId: galleryImage.id });

    response(res, {
      status: "success",
      code: 200,
      dataName: "galleryImage",
      data: galleryImage,
      message: "Successfully created a gallery image",
    });
  }),

  getGalleryImages: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await GalleryImage.findAndCountAll({
      subQuery: false,
      limit,
      offset,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        galleryImages: rows,
        count,
      },
    });
  }),

  deleteGalleryImageWithId: catchAsync(async (req, res) => {
    const { id } = req.params;

    const galleryImage = await GalleryImage.findOne({ where: { id } });

    if (!galleryImage) throw new Error("Gallery image not found");

    await GalleryImage.destroy({ where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully deleted gallery image with id ${id}`,
    });
  }),
};
