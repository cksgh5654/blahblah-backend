const { withAuth } = require('../middleware/auth.middleware');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  matchOwner,
  getCommentsByUserId,
  getUserCommentsCount,
} = require('../services/comment.service');

const commentController = require('express').Router();

commentController.post('/', withAuth, async (req, res) => {
  const { postId, content } = req.body;
  const creator = req.userId;
  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
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
    if (!post) {
      throw new Error('댓글 등록에 실패했습니다.');
    }
    return res
      .status(201)
      .json({ isError: false, message: '댓글이 등록되었습니다.' });
  } catch (err) {
    console.error(`[comment/create]:`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

commentController.post('/view', async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '등록된 게시글이 아닙니다.' });
  }
  try {
    const comments = await getComments({ postId });
    if (!comments) {
      throw new Error('댓글 조회에 실패했습니다.');
    }
    return res.status(200).json({ isError: false, comments });
  } catch (err) {
    console.error(`[comment/view] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

commentController.put('/:commentId', withAuth, async (req, res) => {
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
    const isOwner = await matchOwner({ commentId, creator });
    if (!isOwner) {
      throw new Error('해당 댓글의 수정 및 삭제 권한이 없습니다.');
    }
    const comment = await updateComment({ commentId, content });
    if (!comment) {
      throw new Error('댓글 수정에 실패했습니다.');
    }
    return res
      .status(200)
      .json({ isError: false, message: '댓글이 수정되었습니다.' });
  } catch (err) {
    console.error(`[comment/update/:commentId] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
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
    const isOwner = await matchOwner({ commentId, creator });
    if (!isOwner) {
      throw new Error('해당 댓글의 수정 및 삭제 권한이 없습니다.');
    }
    const comment = await deleteComment({ commentId });
    if (!comment) {
      throw new Error('댓글 수정에 실패했습니다.');
    }
    return res
      .status(200)
      .json({ isError: false, message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error(`[comment/:commentId] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

commentController.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [comments, totalCommentsCount] = await Promise.all([
      getCommentsByUserId(userId, { limit, page }),
      getUserCommentsCount(userId),
    ]);
    const totalPage = Math.ceil(totalCommentsCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;
    return res.status(200).json({
      isError: false,
      data: {
        comments,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalCommentsCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: '댓글 정보 가져오는데 실패했습니다.' });
  }
});

commentController.get('/checkuser/:commentId', withAuth, async (req, res) => {
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
      .json({ isError: true, message: '게시글 정보가 없습니다.' });
  }
  try {
    const isOwner = await matchOwner({ commentId, creator });
    if (!isOwner) {
      throw new Error('해당 댓글의 수정 및 삭제 권한이 없습니다.');
    }
    return res.status(200).json({ isError: false, IsAuthor: isOwner });
  } catch (err) {
    console.error(`[comment/checkuser/:commentId]:`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});
module.exports = commentController;
