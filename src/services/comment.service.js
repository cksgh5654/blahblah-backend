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

  return {
    comments,
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

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
