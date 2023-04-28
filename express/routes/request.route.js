const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createRequest,
  getRequests,
  deleteRequest,
} = require("../controllers/request.controller");

router.post("/", createRequest);
router.get("/", adminMiddleware, getRequests);
router.delete("/:id", adminMiddleware, deleteRequest);

module.exports = router;
