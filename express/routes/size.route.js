const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createSize,
  getSizes,
  changeSize,
  deleteSize,
} = require("../controllers/size.controller");

router.post("/", adminMiddleware, createSize);
router.get("/", getSizes);
router.patch("/:id", adminMiddleware, changeSize);
router.delete("/:id", adminMiddleware, deleteSize);

module.exports = router;
