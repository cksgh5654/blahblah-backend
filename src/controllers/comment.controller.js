const {
  getCommentsByUserId,
  getUserCommentsCount,
} = require("../services/comment.service");

const commentController = require("express").Router();

commentController.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [comments, totalCommentsCount] = await Promise.all([
      getCommentsByUserId(userId, { limit, page }),
      getUserCommentsCount(userId),
    ]);
    const totalPage = Math.ceil(totalCommentsCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;
    return res.status(200).json({
      isError: false,
      data: {
        comments,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalCommentsCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "댓글 정보 가져오는데 실패했습니다." });
  }
});

module.exports = commentController;
