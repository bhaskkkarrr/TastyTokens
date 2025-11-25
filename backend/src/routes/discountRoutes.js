const express = require("express");
const discountRoutes = express.Router();
const discountController = require("../controllers/discountController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
discountRoutes.post(
  "/create",
  verifyToken,
  authorizeRoles("admin"),
  discountController.createDiscount
);
discountRoutes.get(
  "/discounts",
  verifyToken,
  authorizeRoles("admin"),
  discountController.getAllDiscounts
);
discountRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  discountController.deleteDiscount
);
discountRoutes.patch(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  discountController.toggleDiscount
);
exports.discountRoutes = discountRoutes;
