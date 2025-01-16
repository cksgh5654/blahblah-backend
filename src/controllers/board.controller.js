const jwt = require("jsonwebtoken");
const config = require("../../consts");
const { withAuth } = require("../middleware/auth.middleware");
const {
  createBoard,
  getBoardsByCategoryName,
  getBoardById,
  getBoardByManagerId,
  getBoardDataByUrAndUserId,
  getBoardByName,
  getBoardId,
  getAllBoardsByCatogoryName,
  getAllBoardsByName,
  getBoardDataByUrl,
  getBoardUserInfo,
} = require("../services/board.service");
const {
  updateBoardUser,
  getBoardUsersCount,
  getBoardUsersById,
  createBoardUser,
} = require("../services/boardUser.service");
const {
  getPostByBoardId,
  getBoardPostsCount,
} = require("../services/post.service");
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
  const { page, limit } = req.query;

  try {
    const result = await getBoardsByCategoryName(name, page, limit);

    if (result.isError) {
      return res.status(400).json({ isError: true, message: result.message });
    }

    return res.status(200).json({
      isError: false,
      data: result.data,
      totalCount: result.totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isError: true, message: error.message });
  }
});

boardController.get("/boardId/:boardId", withAuth, async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await getBoardById(boardId);
    if (board.manager._id.toString() !== req.userId) {
      return res.status(401).json({
        isError: false,
        message: "게시판 정보는 매니저만 접근 할 수 있습니다.",
      });
    }

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

boardController.put("/:boardId/users/:userId", withAuth, async (req, res) => {
  const { boardId, userId } = req.params;
  const { joinedStatus } = req.body;
  const updatedData = joinedStatus
    ? { joinedStatus }
    : { joinedStatus, deletedAt: Date.now() };
  try {
    await updateBoardUser(boardId, userId, updatedData);
    return res
      .status(200)
      .json({ isError: false, message: "유저 정보를 수정하였습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보를 수정하는데 실패했습니다." });
  }
});

boardController.get("/:boardId/posts", withAuth, async (req, res) => {
  const { boardId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [posts, totalPostsCount] = await Promise.all([
      getPostByBoardId(boardId, { limit, page }),
      getBoardPostsCount(boardId),
    ]);
    const totalPage = Math.ceil(totalPostsCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;
    return res.status(200).json({
      isError: false,
      data: {
        posts,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalPostsCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시글 정보를 가져오는데 실패했습니다.",
    });
  }
});

boardController.get("/user-info", withAuth, async (req, res) => {
  const { boardUrl } = req.query;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, config.jwt.secretKey);
  const userId = decoded.userId;

  try {
    const data = await getBoardUserInfo({
      userId,
      boardUrl,
    });
    return res.status(200).json({
      isError: false,
      isJoin: data.isJoin,
      isApply: data.isApply,
      userId: userId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시판 유저 정보를 가져오는데 실패했습니다.",
    });
  }
});

boardController.get("/board-user", async (req, res) => {
  const { boardUrl, page, limit } = req.query;

  try {
    const data = await getBoardDataByUrl({
      boardUrl,
      page,
      limit,
    });
    return res.status(200).json({
      isError: false,
      board: data.board,
      basicPosts: data.basicPosts,
      notificationPosts: data.notificationPosts,
      totalPostCount: data.totalPostCount,
    });
  } catch (error) {
    if (error.message === "보드가 없습니다") {
      return res.status(404).json({
        isError: true,
        message: "보드가 없습니다.",
      });
    }
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시글 정보를 가져오는데 실패했습니다.",
    });
  }
});

boardController.post("/createBoardUser", async (req, res) => {
  const { board, user } = req.body;
  try {
    const createResult = await createBoardUser({ board, user });
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

boardController.get("/board-url/:url", withAuth, async (req, res) => {
  const { url } = req.params;
  const creator = req.userId;

  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: "로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.",
    });
  }

  try {
    const board = await getBoardId({ url });
    if (board) {
      return res.status(200).json({ isError: false });
    }
  } catch (err) {
    console.error(`[/board-url/:url]`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

boardController.get("/board-name", async (req, res) => {
  const { boardName } = req.query;
  try {
    const boards = await getBoardByName(boardName);

    if (!boards) {
      return res
        .status(200)
        .json({ isError: false, message: "게시판이 없습니다." });
    }

    return res.status(200).json({ isError: false, boards });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

boardController.get("/boards/category-name", async (req, res) => {
  const { categoryName, page, limit } = req.query;
  try {
    const boards = await getAllBoardsByCatogoryName(categoryName, page, limit);

    if (!boards) {
      return res
        .status(200)
        .json({ isError: false, message: "게시판이 없습니다." });
    }

    return res.status(200).json({
      isError: false,
      boards: boards.boards,
      totalBoardCount: boards.totalBoardCount,
    });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

boardController.get("/boards/board-name", async (req, res) => {
  const { boardName, page, limit } = req.query;
  try {
    const boards = await getAllBoardsByName(boardName, page, limit);
    if (boards.isError) {
      return res.status(400).json({ isError: true, message: boards.message });
    }

    if (!boards) {
      return res
        .status(400)
        .json({ isError: false, message: "게시판이 없습니다." });
    }

    return res.status(200).json({
      isError: false,
      data: boards.data,
      totalCount: boards.totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

module.exports = boardController;
