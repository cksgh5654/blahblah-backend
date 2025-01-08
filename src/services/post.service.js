const Post = require('../schemas/post.schema');

const createPost = async ({ creator, board, title, content }) => {
  const post = await Post.create({ creator, board, title, content });

  if (!post) {
    const errorMsg = '게시글 등록에 실패했습니다.';
    return { errorMsg };
  }

  return {
    post: post.toObject(),
    errorMsg: null,
  };
};

module.exports = {
  createPost,
};
