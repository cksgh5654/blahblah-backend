const {
  getBoard,
  getTotalBoardCount,
  deleteBoard,
} = require("../services/board.service");
const {
  getUsers,
  getTotalUsersCount,
  deleteUser,
} = require("../services/user.service");

const adminController = require("express").Router();

adminController.get("/board", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [board, totalBoardCount] = await Promise.all([
      getBoard({ page, limit }),
      getTotalBoardCount(),
    ]);
    const totalPage = Math.ceil(totalBoardCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;

    return res.status(200).json({
      isError: false,
      data: {
        board,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalBoardCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "게시판 데이터를 가져오는데 실패했습니다.",
    });
  }
});

adminController.get("/users", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [users, totalUsersCount] = await Promise.all([
      getUsers({ page, limit }),
      getTotalUsersCount(),
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
      message: "유저 데이터를 가져오는데 실패했습니다.",
    });
  }
});

adminController.delete("/board/:boardId", async (req, res) => {
  const { boardId } = req.params;
  try {
    await deleteBoard(boardId);
    return res
      .status(200)
      .json({ isError: false, message: "게시판을 삭제 하였습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "게시판 삭제를 실패하였습니다." });
  }
});

adminController.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await deleteUser(userId);
    return res
      .status(200)
      .json({ isError: false, message: "유저 정보를 삭제하였습니다." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: "유저 정보를 삭제하는데 실패하였습니다.",
    });
  }
});

module.exports = adminController;
