const authController = require("./auth.controller");
const userController = require("./user.controller");
const apiController = require("express").Router();

apiController.use("/auth", authController);
apiController.use("/user", userController);

module.exports = apiController;
