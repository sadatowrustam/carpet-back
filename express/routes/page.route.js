const express = require("express");
const router = express.Router();

const { getAddCarpetInfo } = require("../controllers/page.controller");

router.get("/add-carpet", getAddCarpetInfo);

module.exports = router;
