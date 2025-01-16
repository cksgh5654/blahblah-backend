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
    const boardsInCategory = await Board.find({
      approvalStatus: "승인",
      category: name,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("manager", "email nickname");

    const totalCount = await Board.countDocuments({
      approvalStatus: "승인",
      category: name,
      deletedAt: null,
    });

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
    const board = await Board.find({ manager: id, deletedAt: null }).lean();
    return board;
  } catch (error) {
    throw new Error(`[DB Error] getBoardByManagerId`, { cause: error });
  }
};

const getBoardUserInfo = async (data) => {
  try {
    const { userId, boardUrl } = data;

    const board = await Board.findOne({ url: boardUrl });

    const boardUser = await BoardUser.findOne({
      user: userId,
      board: board._id,
    });

    const isJoin = boardUser ? boardUser.joinedStatus : false;
    const isApply = boardUser ? true : false;

    return {
      isJoin,
      isApply,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBoardDataByUrl = async (data) => {
  try {
    const { boardUrl, page, limit } = data;
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

    return { board, basicPosts, notificationPosts, totalPostCount };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBoardByName = async (name) => {
  try {
    const boards = await Board.find(
      {
        name: { $regex: name, $options: "i" },
        deletedAt: null,
        approvalStatus: "승인",
      },
      { name: 1, url: 1 }
    );
    return { boards };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBoardId = async ({ url }) => {
  try {
    const board = await Board.findOne({ url }).lean();

    if (!board) {
      throw new Error("등록된 게시판이 아닙니다.");
    }
    return board;
  } catch (error) {
    throw error;
  }
};

const getBoard = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  try {
    const board = await Board.find({
      deletedAt: null,
      approvalStatus: {
        $in: ["대기", "승인"],
      },
    }) //
      .populate("manager")
      .skip(skip)
      .limit(limit)
      .lean();
    return board;
  } catch (error) {
    throw new Error(`[DB 에러] getBoard`, { cause: error });
  }
};

const getTotalBoardCount = async () => {
  try {
    return await Board.find({
      deletedAt: null,
      approvalStatus: { $in: ["대기", "승인"] },
    }).countDocuments();
  } catch (error) {
    throw new Error(`[DB 에러] getTotalBoardCount`, { cause: error });
  }
};

const deleteBoard = async (boardId) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { deletedAt: Date.now() }
    );
    return board;
  } catch (error) {
    throw new Error("[DB에러 deleteBoard]", { cause: error });
  }
};

const getAllBoardsByCatogoryName = async (name, page, limit) => {
  try {
    const skip = page * limit;
    const boards = await Board.find({
      category: name,
      deletedAt: null,
      approvalStatus: "승인",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBoardCount = await Board.countDocuments({
      category: name,
      deletedAt: null,
      approvalStatus: "승인",
    });
    return { boards, totalBoardCount };
  } catch (err) {
    console.log(`getAllBoardsByCatogoryName 에러 ${err}`);
    return { isError: true, message: "게시판 가져오기 실패" };
  }
};

const getAllBoardsByName = async (name, page, limit) => {
  try {
    const skip = page * limit;
    const boardsInSearch = await Board.find({
      name: { $regex: name, $options: "i" },
      deletedAt: null,
      approvalStatus: "승인",
    })
      .skip(skip)
      .limit(limit)
      .populate("manager", "email nickname");

    const totalCount = await Board.countDocuments({
      name: { $regex: name, $options: "i" },
      deletedAt: null,
      approvalStatus: "승인",
    });

    const boards = await Promise.all(
      boardsInSearch.map(async (board) => {
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

const updateBoardStatus = async (boardId, approvalStatus) => {
  const deletedAt = approvalStatus === "미승인" ? Date.now() : null;
  try {
    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { approvalStatus, deletedAt }
    );
    return board;
  } catch (error) {
    throw new Error(`[DB에러 updateBoardStatus]`, { cause: error });
  }
};

module.exports = {
  createBoard,
  getBoardsByCategoryName,
  getBoardById,
  getBoardByManagerId,
  getBoardUserInfo,
  getBoardDataByUrl,
  getBoardByName,
  getBoardId,
  getBoard,
  getTotalBoardCount,
  deleteBoard,
  getAllBoardsByCatogoryName,
  getAllBoardsByName,
  updateBoardStatus,
};
