const express = require("express");
const publicRoutes = express.Router();
const publicController = require("../controllers/publicController");
publicRoutes.get(
  "/r/:restaurantId/t/:tableCode",
  publicController.getPublicMenu
);

exports.publicRoutes = publicRoutes;
