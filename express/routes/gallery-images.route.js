const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../controllers/auth.controller");
const {
  createGalleryImage,
  getGalleryImages,
  deleteGalleryImageWithId,
} = require("../controllers/gallery-image.controller");

router.post("/",adminMiddleware,createGalleryImage);
router.get("/", getGalleryImages);
router.post("/delete/:id", adminMiddleware, deleteGalleryImageWithId);

module.exports = router;
