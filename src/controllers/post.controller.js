const { withAuth } = require('../middleware/auth.middleware');
const { createPost } = require('../services/post.service');
const postController = require('express').Router();

postController.post('/create', withAuth, async (req, res) => {
  const { board, title, content } = req.body;
  const creator = req.userId;

  if (!title || !content) {
    return res
      .status(400)
      .json({ isError: true, message: '모든 필드를 입력해주세요.' });
  }

  if (!board) {
    return res
      .status(400)
      .json({ isError: true, message: '등록된 게시판이 아닙니다.' });
  }

  try {
    const post = await createPost({ creator, board, title, content });

    if (post.errorMsg !== null) {
      throw new Error(post.errorMsg);
    }

    return res
      .status(201)
      .json({ isError: false, message: '게시글이 등록되었습니다.' });
  } catch (err) {
    console.error(`[post/create]: ${err}`);
    return res.status(500).json({ isError: true, message: `${err}` });
  }
});

module.exports = postController;
