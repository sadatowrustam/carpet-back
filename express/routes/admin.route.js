const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  getAdmins,
  getModeratorById,
  createAdmin,
  editModerator,
  login,
  deleteAdmin,
} = require("../controllers/admin.controller");

router.get("/", adminMiddleware, getAdmins);
router.get("/:id", adminMiddleware, getModeratorById);
router.post("/", adminMiddleware, createAdmin);
router.patch("/:id", adminMiddleware, editModerator);
router.post("/login", login);
router.delete("/:id", adminMiddleware, deleteAdmin);

module.exports = router;
