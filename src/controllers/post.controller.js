const { withAuth } = require('../middleware/auth.middleware');
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  matchOwner,
  getUserPostsCount,
  getPostsByUserId,
} = require('../services/post.service');
const { getBoardId } = require('../services/board.service');
const postController = require('express').Router();

postController.post('/', withAuth, async (req, res) => {
  const { url, title, content, type } = req.body;
  const creator = req.userId;
  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
  if (!title || !content || !url) {
    return res
      .status(400)
      .json({ isError: true, message: '모든 필드를 입력해주세요.' });
  }
  try {
    const board = await getBoardId({ url });
    if (!board) {
      throw new Error('등록된 게시판이 없습니다.');
    }
    const boardId = board._id;
    const post = await createPost({
      creator,
      boardId,
      title,
      content,
      type,
    });
    if (!post) {
      throw new Error('게시글 등록에 실패했습니다.');
    }
    return res.status(201).json({ isError: false, post });
  } catch (err) {
    console.error(`[/post] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

postController.get('/detail/:postId', async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '게시글에 대한 정보가 없습니다.' });
  }
  try {
    const post = await getPost({ postId });
    if (!post) {
      throw new Error('게시글 조회에 실패했습니다.');
    }
    return res.status(200).json({ isError: false, post });
  } catch (err) {
    console.error(`[post/detail] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

postController.get('/checkuser/:postId', withAuth, async (req, res) => {
  const { postId } = req.params;
  const creator = req.userId;
  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '게시글 정보가 없습니다.' });
  }
  try {
    const isOwner = await matchOwner({ postId, creator });
    if (!isOwner) {
      throw new Error('해당 게시글의 수정 및 삭제 권한이 없습니다.');
    }
    return res.status(200).json({ isError: false, IsAuthor: isOwner });
  } catch (err) {
    console.error(`[post/checkuser/:postId] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

postController.put('/:postId', withAuth, async (req, res) => {
  const { title, content } = req.body;
  const { postId } = req.params;
  const creator = req.userId;
  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
  if (!title || !content) {
    return res
      .status(400)
      .json({ isError: true, message: '모든 필드를 입력해주세요.' });
  }
  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '게시글 정보가 없습니다.' });
  }
  try {
    const isOwner = await matchOwner({ postId, creator });
    if (!isOwner) {
      throw new Error('해당 게시글의 수정 및 삭제 권한이 없습니다.');
    }
    const post = await updatePost({ postId, title, content });
    if (!post) {
      throw new Error('게시글 수정에 실패했습니다.');
    }
    return res.status(200).json({ isError: false });
  } catch (err) {
    console.error(`[post/:postId] :`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

postController.delete('/:postId', withAuth, async (req, res) => {
  const { postId } = req.params;
  const creator = req.userId;
  if (!creator) {
    return res.status(401).json({
      isError: true,
      message: '로그인 유지시간이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
  if (!postId) {
    return res
      .status(400)
      .json({ isError: true, message: '게시글 정보가 없습니다.' });
  }
  try {
    const isOwner = await matchOwner({ postId, creator });
    if (!isOwner) {
      throw new Error('해당 게시글의 수정 및 삭제 권한이 없습니다.');
    }
    const post = await deletePost({ postId });
    if (!post) {
      throw new Error('게시글 삭제에 실패했습니다.');
    }
    return res
      .status(200)
      .json({ isError: false, message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    console.error(`[post/:postId]:`, err.message);
    return res.status(500).json({ isError: true, message: err.message });
  }
});

postController.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [posts, totalPostsCount] = await Promise.all([
      getPostsByUserId(userId, { limit, page }),
      getUserPostsCount(userId),
    ]);
    const totalPage = Math.ceil(totalPostsCount / limit);
    const nextPage = page + 1 > totalPage ? totalPage : page + 1;
    const prevPage = page - 1 === 0 ? page : page - 1;
    return res.status(200).json({
      isError: false,
      data: {
        posts,
        pageInfo: {
          currentPage: page,
          nextPage,
          prevPage,
          totalPage,
          totalPostsCount,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: true,
      message: '게시글 정보를 가져오는데 실패했습니다.',
    });
  }
});

module.exports = postController;
