const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  getAdmins,
  createAdmin,
  editModerator,
  login,
} = require("../controllers/admin.controller");

router.get("/", adminMiddleware, getAdmins);
// router.get("/:id", adminMiddleware, getModeratorById);
router.post("/", adminMiddleware, createAdmin);
router.patch("/", adminMiddleware, editModerator);
router.post("/login", login);

module.exports = router;
