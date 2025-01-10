const { withAuth } = require('../middleware/auth.middleware');
const { createComment } = require('../services/comment.service');

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

module.exports = commentController;
