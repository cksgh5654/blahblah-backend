const authController = require('./auth.controller');
const userController = require('./user.controller');
const apiController = require('express').Router();

const postController = require('./post.controller');

apiController.use('/auth', authController);
apiController.use('/user', userController);
apiController.use('/post', postController);

module.exports = apiController;
