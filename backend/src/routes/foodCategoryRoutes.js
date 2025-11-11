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
categoryRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  categoryController.deleteCategory
);

categoryRoutes.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  categoryController.updateCategory
);
exports.categoryRoutes = categoryRoutes;
