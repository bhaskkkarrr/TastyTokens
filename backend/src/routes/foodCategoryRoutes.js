const express = require("express");
const categoryRoutes = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const categoryController = require("../controllers/foodCategoryController");

categoryRoutes.post(
  "/add",
  verifyToken,
  authorizeRoles("admin"),
  categoryController.postAddCategory
);
categoryRoutes.get(
  "/categories",
  verifyToken,
  authorizeRoles("admin"),
  categoryController.getAllCategory
);

exports.categoryRoutes = categoryRoutes ;