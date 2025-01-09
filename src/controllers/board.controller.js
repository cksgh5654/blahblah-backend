const jwt = require("jsonwebtoken");
const config = require("../../consts");
const { withAuth } = require("../middleware/auth.middleware");
const {
  createBoard,
  getBoardsByCategoryName,
} = require("../services/board.service");

const { createBoard, getBoardById } = require("../services/board.service");
const {
  updateBoardUser,
  getBoardUsersCount,
  getBoardUsersById,
} = require("../services/BoardUser.service");
const boardController = require("express").Router();

boardController.post("/submit", withAuth, async (req, res) => {
  const { name, description, url, image, category, memberCount, postCount } =
    req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.jwt.secretKey);

  try {
    const createResult = await createBoard({
      name,
      description,
      image,
      url,
      category,
      memberCount,
      postCount,
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

boardController.get("/category/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const result = await getBoardsByCategoryName(name);

    if (result.isError) {
      return res.status(400).json({ isError: true, message: result.message });
    }

    return res.status(200).json({ isError: false, data: result.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isError: true, message: error.message });
  }
});

boardController.get("/boardId/:boardId", withAuth, async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await getBoardById(boardId);
    return res.status(200).json({ isError: false, board });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시판 정보를 가져오는데 실패했습니다.",
    });
  }
});

boardController.get("/managerId", withAuth, async (req, res) => {
  try {
    const board = await getBoardByManagerId(req.userId);
    return res.status(200).json({ isError: false, board });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시판 데이터를 가져오는데 실패했습니다.",
    });
  }
});

module.exports = boardController;
