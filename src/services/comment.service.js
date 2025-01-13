const Comment = require('../schemas/comment.schema');

const createComment = async ({ postId, creator, content }) => {
  const comment = await Comment.create({ post: postId, creator, content });

  if (!comment) {
    const errorMsg = '댓글 등록에 실패했습니다.';
    return { errorMsg };
  }

  return {
    comment: comment.toObject(),
    errorMsg: null,
  };
};

const getComments = async ({ postId }) => {
  const comments = await Comment.find({ post: postId })
    .populate('creator', 'image nickname')
    .lean();

  if (!comments) {
    const errorMsg = '댓글 조회에 실패했습니다.';
    return { errorMsg };
  }

  const NonDeletedcomments = comments.filter(
    ({ deletedAt }) => deletedAt === null
  );

  return {
    comments: NonDeletedcomments,
    errorMsg: null,
  };
};

const updateComment = async ({ commentId: _id, content }) => {
  const comment = await Comment.findByIdAndUpdate({ _id }, { content }).lean();

  if (!comment) {
    const errorMsg = '댓글 수정에 실패했습니다.';
    return { errorMsg };
  }

  return {
    comment,
    errorMsg: null,
  };
};

const deleteComment = async ({ commentId: _id }) => {
  const deletedDate = new Date();

  const comment = await Comment.findOneAndUpdate(
    { _id },
    { deletedAt: deletedDate }
  ).lean();

  if (!comment) {
    const errorMsg = '댓글 삭제에 실패했습니다.';
    return { errorMsg };
  }

  return {
    comment,
    errorMsg: null,
  };
};

const matchOwner = async ({ commentId, creator }) => {
  const comment = await Comment.findOne({ _id: commentId }).lean();

  if (!comment) {
    const errorMsg = '댓글 조회에 실패했습니다.';
    return { errorMsg };
  }

  const isOwner = String(comment.creator) === creator;

  if (!isOwner) {
    const errorMsg = '해당 댓글의 수정 및 삭제 권한이 없습니다.';
    return { errorMsg };
  }

  return {
    isOwner,
    errorMsg: null,
  };
};

const getCommentsByUserId = async (userId, { limit = 20, page }) => {
  const skip = (page - 1) * limit;
  try {
    const posts = Comment.find({ creator: userId })
      .populate({
        path: 'post',
        populate: {
          path: 'board',
          select: 'image',
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

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  matchOwner,
  getCommentsByUserId,
  getUserCommentsCount,
};
