const jwt = require("jsonwebtoken");
const config = require("../../consts");
const { withAuth } = require("../middleware/auth.middleware");
const { createBoard } = require("../services/board.service");

const boardController = require("express").Router();

boardController.post("/submit", withAuth, async (req, res) => {
  const { name, description, url, image, category } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.jwt.secretKey);

  try {
    const createResult = await createBoard({
      name,
      description,
      image,
      url,
      category,
      manager: decoded.userId,
    });

    if (createResult.isError) {
      return res
        .status(400)
        .json({ isError: true, message: createResult.message });
    }

    return res
      .status(201)
      .json({ isError: false, message: createResult.message });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

module.exports = boardController;
