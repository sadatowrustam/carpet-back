const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createBlogVideo,
  getBlogVideos,
  deleteBlogVideoById,
  editBlogVideoById,
  getBlogVideoById
} = require("../controllers/blog-video.controller");

router.post(
  "/",
  adminMiddleware,
  createBlogVideo
);
router.patch(
  "/:id",
  adminMiddleware,
  editBlogVideoById
);
router.get("/", getBlogVideos);
router.get(
  "/:id",
  getBlogVideoById
);
router.post("/delete/:id", adminMiddleware, deleteBlogVideoById);

module.exports = router;
