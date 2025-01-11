const { withAuth } = require('../middleware/auth.middleware');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../services/comment.service');

const commentController = require('express').Router();

commentController.post('/create', withAuth, async (req, res) => {
  const { postId, content } = req.body;
  const creator = req.userId;

  if (!content) {
    return res
      .status(400)
      .json({ isError: true, message: '댓글 내용을 입력해주세요.' });
  }

  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '등록된 게시글이 아닙니다.' });
  }

  try {
    const post = await createComment({ postId, creator, content });

    if (post.errorMsg !== null) {
      throw new Error(post.errorMsg);
    }

    return res
      .status(201)
      .json({ isError: false, message: '댓글이 등록되었습니다.' });
  } catch (err) {
    console.error(`[comment/create]: ${err}`);
    return res.status(500).json({ isError: true, message: `${err}` });
  }
});

commentController.post('/view', withAuth, async (req, res) => {
  const { postId } = req.body;
  const creator = req.userId;

  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '등록된 게시글이 아닙니다.' });
  }

  try {
    const comments = await getComments({ postId });

    if (comments.errorMsg !== null) {
      throw new Error(comments.errorMsg);
    }

    return res
      .status(200)
      .json({ isError: false, comments: comments.comments });
  } catch (err) {
    console.error(`[comment/view]: ${err}`);
    return res.status(500).json({ isError: true, message: `${err}` });
  }
});

commentController.put('/update/:commentId', withAuth, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const creator = req.userId;

  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }

  if (!commentId) {
    return res
      .status(400)
      .json({ isError: true, message: '댓글 정보가 없습니다.' });
  }

  try {
    const commentData = await updateComment({ commentId, content });

    if (commentData.errorMsg !== null) {
      throw new Error(post.errorMsg);
    }

    return res
      .status(200)
      .json({ isError: false, message: '댓글이 수정되었습니다.' });
  } catch (err) {
    console.error(`[comment/update/:commentId]: ${err}`);
    return res.status(500).json({ isError: true, message: `${err}` });
  }
});

commentController.delete('/:commentId', withAuth, async (req, res) => {
  const { commentId } = req.params;
  const creator = req.userId;

  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }

  if (!commentId) {
    return res
      .status(400)
      .json({ isError: true, message: '댓글 정보가 없습니다.' });
  }

  try {
    const commentData = await deleteComment({ commentId });

    if (commentData.errorMsg !== null) {
      throw new Error(post.errorMsg);
    }

    return res
      .status(200)
      .json({ isError: false, message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error(`[comment/:commentId]: ${err}`);
    return res.status(500).json({ isError: true, message: `${err}` });
  }
});

module.exports = commentController;
