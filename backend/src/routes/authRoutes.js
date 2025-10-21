const express = require("express");
const authRoutes = express.Router();
const authController = require("../controllers/authController");

authRoutes.post("/signup", authController.postSignup);
authRoutes.post("/login", authController.postLogin);

exports.authRoutes = authRoutes;
