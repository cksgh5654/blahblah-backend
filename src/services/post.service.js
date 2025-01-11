const Board = require("../schemas/board.schema");
const Post = require("../schemas/post.schema");

const createPost = async ({
  creator,
  boardId: board,
  title,
  content,
  type = "basic",
}) => {
  const post = await Post.create({ creator, board, title, content, type });

  if (!post) {
    const errorMsg = "게시글 등록에 실패했습니다.";
    return { errorMsg };
  }

  return {
    post: post.toObject(),
    errorMsg: null,
  };
};

const getPost = async ({ postId: _id }) => {
  const post = await Post.findOne({ _id }).lean();

  if (!post) {
    const errorMsg = "게시글 조회에 실패했습니다.";
    return { errorMsg };
  }

  return {
    post,
    errorMsg: null,
  };
};

const updatePost = async ({ postId: _id, title, content }) => {
  const post = await Post.findByIdAndUpdate({ _id }, { title, content }).lean();

  if (!post) {
    const errorMsg = "게시글을 수정에 실패했습니다.";
    return { errorMsg };
  }

  return {
    post,
    errorMsg: null,
  };
};

const deletePost = async ({ postId: _id }) => {
  const post = await Post.findOneAndUpdate({ _id }, { deleteAt: true }).lean();

  if (!post) {
    const errorMsg = "게시글 삭제에 실패했습니다.";
    return { errorMsg };
  }

  return {
    post,
    errorMsg: null,
  };
};

const getPostByBoardId = async (boardId) => {
  try {
    const posts = await Post.find({ board: boardId, deletedAt: null }) //
      .populate("creator")
      .lean();
    return posts;
  } catch (error) {
    throw new Error(error);
  }
};

const getBoardPostsCount = async (boardId) => {
  try {
    return await Post.find({ board: boardId }).countDocuments();
  } catch (error) {
    throw new Error(error);
  }
};

const getPostsByUserId = async (userId, { limit = 20, page }) => {
  const skip = (page - 1) * limit;
  try {
    const posts = Post.find({ creator: userId })
      .populate("board")
      .skip(skip)
      .limit(limit)
      .lean();
    return posts;
  } catch (error) {
    throw new Error(`[DB 에러 getPostsByUserId]`, { cause: error });
  }
};

const getUserPostsCount = async (userId) => {
  try {
    return await Post.find({ creator: userId }).countDocuments();
  } catch (error) {
    throw new Error(`[DB 에러 getUserPostsCount]`, { cause: error });
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostByBoardId,
  getBoardPostsCount,
  getPostsByUserId,
  getUserPostsCount,
};
