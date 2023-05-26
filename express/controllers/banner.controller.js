const { models } = require("../../sequelize");
const { Banner, Image, Video } = models;
const {v4}=require("uuid")
const sharp=require("sharp")
const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");
const AppError = require("../../utils/appError");
module.exports = {
  createBanner: catchAsync(async (req, res) => {
  let{ title, type } = req.body;
  title=JSON.stringify(title)
  const banner = await Banner.create({ title, type });
  return res.send({
    // status: "success",
    code: 200,
    banner,
  });
  }),
  uploadImage:catchAsync(async(req,res)=>{
    const { id } = req.params;
    await Image.destroy({where:{bannerId:id}})
    req.files=Object.values(req.files)
    req.files=intoArray(req.files)
    for (const images of req.files) {
      const image = `${v4()}_banners.webp`;
      const photo = images.data
      let buffer = await sharp(photo).webp().toBuffer()
      await sharp(buffer).toFile(`public/banners/${image}`);
      let newImage = await Image.create({ url: image, bannerId: id })
  }
  return res.send({
    status: "success",
    code: 200,
  });
  }),
  uploadVideo:catchAsync(async(req,res)=>{
    const id=req.params.id
    await Video.destroy({where:{bannerId:id}})
    req.files=Object.values(req.files)
    req.files=intoArray(req.files)
    for (let i=0; i<req.files.length; i++) {
    const url=v4()+"_video.mp4"
    req.files[i].mv("./public/videos/"+url)
    const video = await Video.create({
      url,
      bannerId: id,
    });
  }
  return res.send({
    status:"sucess",
    code:200
  })
  }),
  getBanners: catchAsync(async (req, res) => {
    const { rows, count } = await Banner.findAndCountAll({
      subQuery: false,
      order:[["createdAt", "DESC"],]
    })
    return res.send({
      status: "success",
      code: 200,
      data: {
        banners: rows,
        count,
      },
    });
  }),
  getBannerById: catchAsync(async (req, res) => {
    const { id } = req.params;
    let{ title, type } = req.body;
    title=JSON.stringify(title)
    const banner = await Banner.findOne({ where: { id } });
    await banner.update({title,type})
    res.send({
      status: "success",
      code: 200,
      banner
    });
  }),
  editBannerById: catchAsync(async (req, res,next) => {
    const { id } = req.params;
    let{ title, type } = req.body;
    title=JSON.stringify(title)
    const banner = await Banner.findOne({ where: { id } })
    if(!banner) return next(new AppError("Banner not found",404))
    await Banner.update({title,type},{where:{id}})
    await banner.update({title,type})
    console.log(88)
    res.send({
      status: "success",
      code: 200,
      banner
    });
  }),
  deleteBannerById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const banner = await Banner.findOne({ where: { id } });

    if (!banner) {
      throw new Error(`Couldn't find banner with id ${id}`);
    }

    await Banner.destroy({ where: { id } });

    res.send({
      status: "success",
      code: 200,
    });
  }),
};
const intoArray = (file) => {
  if (file[0].length == undefined) return file
  else return file[0]
}