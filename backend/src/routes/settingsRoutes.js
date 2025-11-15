const express = require("express");
const settingsRoutes = express.Router();
const settingsController = require("../controllers/settingsController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

settingsRoutes.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  settingsController.getSettings
);
settingsRoutes.put(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  settingsController.updateSettings
);

exports.settingsRoutes = settingsRoutes;
