const Post = require('../schemas/post.schema');

const createPost = async ({ creator, boardId: board, title, content }) => {
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

const getPost = async ({ postId: _id }) => {
  const post = await Post.findOne({ _id }).lean();

  if (!post) {
    const errorMsg = '게시글 조회에 실패했습니다.';
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
    const errorMsg = '게시글을 수정에 실패했습니다.';
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
    const errorMsg = '게시글 삭제에 실패했습니다.';
    return { errorMsg };
  }

  return {
    post,
    errorMsg: null,
  };
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
};
