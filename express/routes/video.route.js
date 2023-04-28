const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const { deleteVideo } = require("../controllers/video.controller");

router.delete("/:id", adminMiddleware, deleteVideo);

module.exports = router;
