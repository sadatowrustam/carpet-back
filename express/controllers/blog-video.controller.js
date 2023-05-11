const { models } = require("../../sequelize");
const { Video, BlogVideo } = models;
const {v4}=require("uuid")
const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

module.exports = {
  createBlogVideo: catchAsync(async (req, res) => {
    console.log(req.body,req.files)
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
    let title=JSON.stringify({
      ru:req.body.title_ru,
      en:req.body.title_en
    })
    await blogVideo.update({title})
    console.log(req.files)
    if(req.files!=null){
      req.files=Object.values(req.files)
      req.files=intoArray(req.files)
      const url=blogVideo.blogVideo.url
      req.files[0].mv("./public/videos/"+url)
    }
    res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted blog video with id ${id}`,
    });
  }),
  getBlogVideoById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const blogVideo = await BlogVideo.findOne({ where: { id } });
    res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted blog video with id ${id}`,
      video: blogVideo
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
    return res.send({
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
