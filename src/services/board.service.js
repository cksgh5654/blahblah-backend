const Board = require("../schemas/board.schema");
const BoardUser = require("../schemas/boardUser.schema");
const Post = require("../schemas/post.schema");

const createBoard = async (data) => {
  try {
    const existingName = await Board.findOne({ name: data.name });
    if (existingName) {
      return { isError: true, message: "이름이 중복됩니다" };
    }

    const existingUrl = await Board.findOne({ url: data.url });
    if (existingUrl) {
      return { isError: true, message: "URL이 중복됩니다" };
    }

    await Board.create(data);
    return { isError: false, message: "게시판 등록 신청 성공" };
  } catch (err) {
    console.log(`createBoard 에러 ${err}`);
    return { isError: true, message: "게시판 등록 신청 실패" };
  }
};

const getBoardsByCategoryName = async (name, page, limit) => {
  try {
    const skip = page * limit;
    const boardsInCategory = await Board.find({ category: name })
      .skip(skip)
      .limit(limit)
      .populate("manager", "email nickname");

    const totalCount = await Board.countDocuments({ category: name });

    const boards = await Promise.all(
      boardsInCategory.map(async (board) => {
        const memberCount = await BoardUser.countDocuments({
          joinedStatus: true,
          board: board._id,
        });
        board.memberCount = memberCount;
        return board;
      })
    );

    return { isError: false, data: boards, totalCount };
  } catch (err) {
    console.log(`getBoardsByCategoryName 에러 ${err}`);
    return { isError: true, message: "게시판 가져오기 실패" };
  }
};

const getBoardById = async (id) => {
  try {
    const board = await Board.findOne({ _id: id }) //
      .populate("manager")
      .lean();
    return board;
  } catch (error) {
    throw new Error(`[DB Error] getBoardById`, { cause: error });
  }
};

const getBoardByManagerId = async (id) => {
  try {
    const board = await Board.find({ manager: id }).lean();
    return board;
  } catch (error) {
    throw new Error(`[DB Error] getBoardByManagerId`, { cause: error });
  }
};

const getBoardDataByUrAndUserId = async (data) => {
  try {
    const { boardUrl, userId, page, limit } = data;
    const skip = page * limit;
    const board = await Board.findOne({ url: boardUrl }).populate(
      "manager",
      "email nickname"
    );
    if (!board) {
      throw new Error("보드가 없습니다");
    }

    const basicPosts = await Post.find({
      board: board._id,
      deletedAt: null,
      type: "basic",
    })
      .skip(skip)
      .limit(limit)
      .populate("creator")
      .lean();

    const notificationPosts = await Post.find({
      board: board._id,
      deletedAt: null,
      type: "notification",
    })
      .skip(skip)
      .limit(limit)
      .populate("creator")
      .lean();

    const totalPostCount = {
      basic: 0,
      notification: 0,
    };

    totalPostCount.basic = await Post.countDocuments({
      board: board._id,
      deletedAt: null,
      type: "basic",
    });

    totalPostCount.notification = await Post.countDocuments({
      board: board._id,
      deletedAt: null,
      type: "notification",
    });

    const memberCount = await BoardUser.countDocuments({
      board: board._id,
      joinedStatus: true,
    });

    board.memberCount = memberCount;

    if (userId) {
      const boardUser = await BoardUser.findOne({
        user: userId,
        board: board._id,
      });

      const isJoin = boardUser ? boardUser.joinedStatus : false;
      const isApply = boardUser ? true : false;

      return {
        board,
        basicPosts,
        notificationPosts,
        totalPostCount,
        isJoin,
        isApply,
      };
    }

    return { board, basicPosts, notificationPosts, totalPostCount };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createBoard,
  getBoardsByCategoryName,
  getBoardById,
  getBoardByManagerId,
  getBoardDataByUrAndUserId,
};
