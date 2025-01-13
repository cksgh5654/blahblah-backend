const apiController = require("express").Router();
const authController = require("./auth.controller");
const userController = require("./user.controller");
const boardController = require("./board.controller");
const postController = require("./post.controller");
const categoryController = require("./category.controller");
const commentController = require("./comment.controller");
const adminController = require("./admin.controller");
const { withAuth, onlyAdmin } = require("../middleware/auth.middleware");

apiController.use("/auth", authController);
apiController.use("/user", userController);
apiController.use("/post", postController);
apiController.use("/board", boardController);
apiController.use("/category", categoryController);
apiController.use("/comment", commentController);
apiController.use("/admin", withAuth, onlyAdmin, adminController);

module.exports = apiController;
