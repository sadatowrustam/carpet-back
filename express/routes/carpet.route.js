const express = require("express");
const router = express.Router();

const getFileExtension = (filename) => {
  return filename.split(".").pop();
};

const generateId = () => {
  return Math.floor(Math.random() * Date.now() + Math.random());
};

const returnCarpetImageName = async (file) => {
  return `carpet-${generateId()}.${getFileExtension(file.originalname)}`;
};

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/images",
  filename: async (req, file, cb) => {
    const filename = await returnCarpetImageName(file);
    const filenameWithPath = `/images/${filename}`;
    await req.images.push(filenameWithPath);
    await cb(null, filename);
  },
});
const upload = multer({ storage });

const {
  getAllCarpets,
  createOneCarpet,
  getCarpetById,
  changeCarpetById,
  deleteCarpetById,
} = require("../controllers/carpet.controller");

const createArrayForCarpetImages = (req, res, next) => {
  req.images = [];
  next();
};

const { adminMiddleware } = require("../controllers/auth.controller");

router.get("/", getAllCarpets);
router.post(
  "/",
  adminMiddleware,
  createArrayForCarpetImages,
  upload.array("images", 10),
  createOneCarpet
);
router.get("/:id", getCarpetById);
router.patch(
  "/:id",
  adminMiddleware,
  createArrayForCarpetImages,
  upload.array("images", 10),
  changeCarpetById
);
router.delete("/:id", adminMiddleware, deleteCarpetById);

module.exports = router;
