const express = require("express");
const orderRoutes = express.Router();
const orderController = require("../controllers/OrderController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
orderRoutes.post("/create", orderController.createOrder);
orderRoutes.get(
  "/orders",
  verifyToken,
  authorizeRoles("admin"),
  orderController.getOrdersForRestaurant
);

orderRoutes.put(
  "/update-status/:id",
  verifyToken,
  authorizeRoles("admin"),
  orderController.updateOrderStatus
);

// orderRoutes.delete(
//   '/delete/:id',
//   verifyToken,
//   authorizeRoles("admin"),
//   orderController.deleteOrder
// )
exports.orderRoutes = orderRoutes;
