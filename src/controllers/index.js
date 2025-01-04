const authController = require("./auth.controller");
const apiController = require("express").Router();

apiController.use("/auth", authController);

module.exports = apiController;
