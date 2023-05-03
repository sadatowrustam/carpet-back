const { models } = require("../../sequelize");
const { GalleryImage, Image } = models;
const sharp=require("sharp")
const {v4}=require("uuid")
const catchAsync = require("../../utils/catchAsync");

module.exports = {
  createGalleryImage: catchAsync(async (req, res) => {
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    let imagesArray=[]    
    const galleryImage = await GalleryImage.create({ title:"n" });
    for (const images of req.files) {
      const image = `${v4()}_gallery.webp`;
      const photo = images.data
      let buffer = await sharp(photo).webp().toBuffer()
      await sharp(buffer).toFile(`public/images/${image}`);
      let newImage = await Image.create({ url: image, galleryImageId: galleryImage.id })
      imagesArray.push(newImage)
  }
    console.log("eyyam dyndym1")
    return res.send({
      status: "success",
      code: 200,
      data: imagesArray,
    });
    }),

  getGalleryImages: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await GalleryImage.findAndCountAll({
      subQuery: false,
      limit,
      offset,
    });
    return res.send({
      status: "success",
      code: 200,
      data: {
        galleryImages: rows,
        count,
      },
    });
  }),
  deleteGalleryImageWithId: catchAsync(async (req, res) => {
    const { id } = req.params;
    const galleryImage = await GalleryImage.findOne({ where: { id } });

    if (!galleryImage) throw new Error("Gallery image not found",404);

    await GalleryImage.destroy({ where: { id } });

    return res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted gallery image with id ${id}`,
    });
  }),
};
const intoArray = (file) => {
  if (file[0].length == undefined) return file
  else return file[0]
}