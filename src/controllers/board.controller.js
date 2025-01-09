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

boardController.get("/:boardId/users", withAuth, async (req, res) => {
  const { boardId } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  if (!page) {
    return res
      .status(500)
      .json({ isError: true, message: "페이지 정보가 필요합니다." });
  }
  try {
    const [users, totalUsersCount] = await Promise.all([
      getBoardUsersById(boardId, { limit, page }),
      getBoardUsersCount(boardId),
    ]);
    const totalPage = Math.ceil(totalUsersCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;
    return res.status(200).json({
      isError: false,
      data: {
        users,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalUsersCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시판 유저 정보를 가져오는데 실패했습니다.",
    });
  }
});

boardController.delete(
  "/:boardId/users/:userId",
  withAuth,
  async (req, res) => {
    const { boardId, userId } = req.params;
    try {
      await updateBoardUser(boardId, userId, {
        deletedAt: Date.now(),
        joinedStatus: false,
      });
      return res
        .status(200)
        .json({ isError: false, message: "유저 정보를 삭제하였습니다." });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ isError: true, message: "유저 정보 삭제하는데 실패했습니다." });
    }
  }
);

module.exports = boardController;
