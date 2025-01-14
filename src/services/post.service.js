const Post = require("../schemas/post.schema");
const Comment = require("../schemas/comment.schema");

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
  const post = await Post.findOne({ _id })
    .populate("creator", "image nickname")
    .populate("board", "url")
    .lean();

  if (!post) {
    const errorMsg = "게시글 조회에 실패했습니다.";
    return { errorMsg };
  }

  const NonDeletedPost = post.deletedAt === null ? post : null;

  return {
    post: NonDeletedPost,
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
  const deletedDate = new Date();

  const post = await Post.findOneAndUpdate(
    { _id },
    { deletedAt: deletedDate }
  ).lean();

  if (!post) {
    const errorMsg = "게시글 삭제에 실패했습니다.";
    return { errorMsg };
  }

  const deletedComments = await Comment.updateMany(
    { post: _id },
    { deletedAt: deletedDate }
  );

  if (!deletedComments) {
    const errorMsg = "해당 게시글의 댓글들 삭제에 실패했습니다.";
    return { errorMsg };
  }

  return {
    post,
    errorMsg: null,
  };
};

const matchOwner = async ({ postId, creator }) => {
  const post = await Post.findOne({ _id: postId }).lean();

  if (!post) {
    const errorMsg = "게시글을 조회에 실패했습니다.";
    return { errorMsg };
  }

  const isOwner = String(post.creator) === creator;

  if (!isOwner) {
    const errorMsg = "해당 게시글의 수정 및 삭제 권한이 없습니다.";
    return { errorMsg };
  }

  return {
    isOwner,
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
    const posts = Post.find({ creator: userId, deletedAt: null })
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
    return await Post.find({
      creator: userId,
      deletedAt: null,
    }).countDocuments();
  } catch (error) {
    throw new Error(`[DB 에러 getUserPostsCount]`, { cause: error });
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  matchOwner,
  getPostByBoardId,
  getBoardPostsCount,
  getPostsByUserId,
  getUserPostsCount,
};
