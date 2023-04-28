const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createColor,
  getColors,
  changeColor,
  deleteColor,
} = require("../controllers/color.controller");

router.post("/", adminMiddleware, createColor);
router.get("/", getColors);
router.patch("/:id", adminMiddleware, changeColor);
router.delete("/:id", adminMiddleware, deleteColor);

module.exports = router;
