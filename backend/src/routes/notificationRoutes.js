const express = require("express");
const notificationRoutes = express.Router();
const notificationController = require("../controllers/NotificationController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
// notificationRoutes.post("/create", notificationController.createNotification);
notificationRoutes.get(
  "/notifications",
  verifyToken,
  authorizeRoles("admin"),
  notificationController.getNotifications
);

notificationRoutes.put(
  "/read/:id",
  verifyToken,
  authorizeRoles("admin"),
  notificationController.markSingleRead
);

notificationRoutes.put(
  "/readAll/:restaurantId",
  verifyToken,
  authorizeRoles("admin"),
  notificationController.markAllRead
);
exports.notificationRoutes = notificationRoutes;
