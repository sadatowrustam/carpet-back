const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const { getAllInfo } = require("../controllers/dashboard.controller");

router.get("/", adminMiddleware, getAllInfo);

module.exports = router;
