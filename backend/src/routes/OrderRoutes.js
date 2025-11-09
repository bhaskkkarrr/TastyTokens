const express = require("express");
const orderRoutes = express.Router();
const orderController = require("../controllers/OrderController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
orderRoutes.post("/create", orderController.postCreateOrder);
orderRoutes.get(
  "/orders",
  verifyToken,
  authorizeRoles("admin"),
  orderController.getOrdersByRestaurant
);
orderRoutes.put(
  "/update-status/:id",
  verifyToken,
  authorizeRoles("admin"),
  orderController.updateOrderStatus
);
exports.orderRoutes = orderRoutes;
