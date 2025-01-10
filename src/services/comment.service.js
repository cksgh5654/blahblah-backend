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

module.exports = {
  createComment,
};
