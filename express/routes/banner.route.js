const express = require("express");
const router = express.Router();

const generateFileName = require("../../utils/generateFileName");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/banners",
  filename: async (req, file, cb) => {
    const filename = await generateFileName("banner", file);
    req.filePath = `/banners/${filename}`;
    await cb(null, filename);
  },
});
const upload = multer({ storage });

const createVarForFile = (req, res, next) => {
  req.filePath = "";
  next();
};

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createBanner,
  getBanners,
  deleteBannerById,
} = require("../controllers/banner.controller");

router.post(
  "/",
  adminMiddleware,
  createVarForFile,
  upload.single("file"),
  createBanner
);
router.get("/", getBanners);
router.delete("/:id", adminMiddleware, deleteBannerById);

module.exports = router;
