const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  getMaterials,
  createMaterial,
  changeMaterial,
  deleteMaterial,
  getMaterial,
} = require("../controllers/material.controller");

router.get("/", getMaterials);
router.get("/:id",getMaterial)
router.post("/", adminMiddleware, createMaterial);
router.patch("/:id", adminMiddleware, changeMaterial);
router.post("/delete/:id", adminMiddleware, deleteMaterial);

module.exports = router;
