const Comment = require("../schemas/comment.schema");

const getCommentsByUserId = async (userId, { limit = 20, page }) => {
  const skip = (page - 1) * limit;
  try {
    const posts = Comment.find({ creator: userId })
      .populate({
        path: "post",
        populate: {
          path: "board",
          select: "image",
        },
      })
      .skip(skip)
      .limit(limit)
      .lean();
    return posts;
  } catch (error) {
    throw new Error(`[DB 에러 getCommentsByUserId]`, { cause: error });
  }
};

const getUserCommentsCount = async (userId) => {
  try {
    return await Comment.find({ creator: userId }).countDocuments();
  } catch (error) {
    throw new Error(`[DB 에러 getUserCommentsCount]`, { cause: error });
  }
};

module.exports = { getCommentsByUserId, getUserCommentsCount };
