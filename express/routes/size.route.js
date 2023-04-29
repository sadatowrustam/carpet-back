const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createSize,
  getSizes,
  changeSize,
  deleteSize,
  getSize
} = require("../controllers/size.controller");

router.post("/", adminMiddleware, createSize);
router.get("/", getSizes);
router.get("/:id",getSize)
router.patch("/:id", adminMiddleware, changeSize);
router.post("/delete/:id", adminMiddleware, deleteSize);

module.exports = router;
