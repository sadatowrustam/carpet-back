const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../controllers/auth.controller");
const {
  createBanner,
  getBanners,
  deleteBannerById,
  uploadImage,
  uploadVideo,
  editBannerById,
  getBannerById
} = require("../controllers/banner.controller");

router.post(
  "/",
  adminMiddleware,
  createBanner
);
router.post("/upload-image/:id",uploadImage)
router.post("/upload-video/:id",uploadVideo)

router.get("/", getBanners);
router.get("/:id",getBannerById)
router.patch("/:id",editBannerById)
router.post("/delete/:id", adminMiddleware, deleteBannerById);

module.exports = router;
