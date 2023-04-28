const express = require("express");
const router = express.Router();

const generateFileName = require("../../utils/generateFileName");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/videos",
  filename: async (req, file, cb) => {
    const filename = await generateFileName("video", file);
    req.video = `/videos/${filename}`;
    await cb(null, filename);
  },
});
const upload = multer({ storage });

const createVarForVideo = (req, res, next) => {
  req.video = "";
  next();
};

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createBlogVideo,
  getBlogVideos,
  deleteBlogVideoById,
} = require("../controllers/blog-video.controller");

router.post(
  "/",
  adminMiddleware,
  createVarForVideo,
  upload.single("video"),
  createBlogVideo
);
router.get("/", getBlogVideos);
router.delete("/:id", adminMiddleware, deleteBlogVideoById);

module.exports = router;
