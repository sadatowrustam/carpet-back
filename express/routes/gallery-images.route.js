const express = require("express");
const router = express.Router();

const getFileExtension = (filename) => {
  return filename.split(".").pop();
};

const generateId = () => {
  return Math.floor(Math.random() * Date.now() + Math.random());
};

const returnImageName = async (file) => {
  return `image-${generateId()}.${getFileExtension(file.originalname)}`;
};

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/images",
  filename: async (req, file, cb) => {
    const filename = await returnImageName(file);
    req.image = `/images/${filename}`;
    await cb(null, filename);
  },
});
const upload = multer({ storage });

const createVarForImage = (req, res, next) => {
  req.image = "";
  next();
};

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createGalleryImage,
  getGalleryImages,
  deleteGalleryImageWithId,
} = require("../controllers/gallery-image.controller");

router.post(
  "/",
  adminMiddleware,
  createVarForImage,
  upload.single("image"),
  createGalleryImage
);
router.get("/", getGalleryImages);
router.delete("/:id", adminMiddleware, deleteGalleryImageWithId);

module.exports = router;
