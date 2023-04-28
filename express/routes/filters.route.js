const express = require("express");
const router = express.Router();

const { getAllFilters } = require("../controllers/filters.controller");

router.get("/", getAllFilters);

module.exports = router;
