const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createColor,
  getColors,
  changeColor,
  deleteColor,
  getColor,
} = require("../controllers/color.controller");

router.post("/", adminMiddleware, createColor);
router.get("/", getColors);
router.get("/:id",getColor)
router.patch("/:id", adminMiddleware, changeColor);
router.post("/delete/:id", adminMiddleware, deleteColor);

module.exports = router;
