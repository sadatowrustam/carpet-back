const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createRequest,
  getRequests,
  deleteRequest,
  getOneRequest,
} = require("../controllers/request.controller");

router.post("/", createRequest);
router.get("/", adminMiddleware, getRequests);
router.get("/:id",adminMiddleware,getOneRequest)
router.post("/delete/:id", adminMiddleware, deleteRequest);

module.exports = router;
