const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  getMaterials,
  createMaterial,
  changeMaterial,
  deleteMaterial,
} = require("../controllers/material.controller");

router.get("/", getMaterials);
router.post("/", adminMiddleware, createMaterial);
router.patch("/:id", adminMiddleware, changeMaterial);
router.delete("/:id", adminMiddleware, deleteMaterial);

module.exports = router;
