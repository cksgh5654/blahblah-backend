const apiController = require("express").Router();
const authController = require("./auth.controller");
const userController = require("./user.controller");
const boardController = require("./board.controller");
const postController = require("./post.controller");
const categoryController = require("./category.controller");

apiController.use("/auth", authController);
apiController.use("/user", userController);
apiController.use("/post", postController);
apiController.use("/board", boardController);
apiController.use("/category", categoryController);

module.exports = apiController;
