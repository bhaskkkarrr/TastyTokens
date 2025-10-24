const express = require("express");
const tableRoutes = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const TableController = require("../controllers/TableController");

tableRoutes.post(
  "/create",
  verifyToken,
  authorizeRoles("admin"),
  TableController.postAddTable
);

tableRoutes.get(
  "/tables",
  verifyToken,
  authorizeRoles("admin"),
  TableController.getAllTables
);

tableRoutes.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  TableController.deleteStudent
);

exports.tableRoutes = tableRoutes;
