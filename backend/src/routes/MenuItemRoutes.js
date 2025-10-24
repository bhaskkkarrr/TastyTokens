const express = require("express");
const menuItemRoutes = express.Router();
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const menuItemsController = require("../controllers/MenuItemsController");

menuItemRoutes.post(
  "/add",
  verifyToken,
  authorizeRoles("admin"),
  upload.single("image"),
  menuItemsController.postAddMenuItems
);
menuItemRoutes.get(
  "/items",
  verifyToken,
  authorizeRoles("admin", "customer"),
  menuItemsController.getAllMenuItems
);
menuItemRoutes.get("/r/:restaurantId/t/:tableCode", menuItemsController.getPublicMenu);

exports.menuItemRoutes = menuItemRoutes;
