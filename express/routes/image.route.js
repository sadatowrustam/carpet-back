const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const { deleteImageById } = require("../controllers/image.controller");

router.delete("/:id", adminMiddleware, deleteImageById);

module.exports = router;
