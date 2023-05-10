const { models } = require("../../sequelize");
const { Video, BlogVideo } = models;
const {v4}=require("uuid")
const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  createBlogVideo: catchAsync(async (req, res) => {
    console.log(req.file,req.files,req.body)
    req.files=Object.values(req.files)
    req.files=intoArray(req.files)
    for (let i=0; i<req.files.length; i++) {
    let title=JSON.stringify({
      ru:req.body.title_ru,
      en:req.body.title_en
    })
    const url=v4()+"_video.mp4"
    req.files[i].mv("./public/videos/"+url)
    const blogVideo = await BlogVideo.create({ title });
    const video = await Video.create({
      url,
      blogVideoId: blogVideo.id,
    });
  }
    return res.send({
      status: "success",
      code: 200,
      dataName: "video",
    });
  }),
  editBlogVideoById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const blogVideo = await BlogVideo.findOne({ where: { id } });
    req.files=Object.values(req.files)
    req.files=intoArray(req.files)
    console.log(req.body)
    let title=JSON.stringify({
      ru:req.body.title_ru,
      en:req.body.title_en
    })
    const url=blogVideo.blogVideo.url
    req.files[0].mv("./public/videos/"+url)
    await blogVideo.update({title})
    res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted blog video with id ${id}`,
    });
  }),
  getBlogVideos: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await BlogVideo.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

   res.send({      
    code: 200,
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
    await Video.destroy({where:{blogVideoId:id}})
    res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted blog video with id ${id}`,
    });
  }),
};

const intoArray = (file) => {
  if (file[0].length == undefined) return file
  else return file[0]
}
