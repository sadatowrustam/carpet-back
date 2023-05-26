const express = require("express");
const router = express.Router();

const { adminMiddleware } = require("../controllers/auth.controller");

const {
  createOrder,
  getOrders,
  getOrderById,
  changeOrderById,
  deleteOrder,
} = require("../controllers/order.controller");

router.post("/",  createOrder);
router.get("/", adminMiddleware, getOrders);
router.get("/:id", adminMiddleware, getOrderById);
router.patch("/:id", adminMiddleware, changeOrderById);
router.post("/delete/:id", adminMiddleware, deleteOrder);

module.exports = router;
