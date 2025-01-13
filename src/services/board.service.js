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
    const boards = await Board.find({ category: name })
      .skip(skip)
      .limit(limit)
      .populate("manager", "email nickname");

    const totalCount = await Board.countDocuments({ category: name });

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
    const board = await Board.findOne({ url: data.boardUrl }).populate(
      "manager",
      "email nickname"
    );
    if (!board) {
      throw new Error("보드가 없습니다");
    }

    const boardUser = await BoardUser.findOne({
      user: data.userId,
      board: board._id,
    });

    const isJoin = boardUser ? boardUser.joinedStatus : false;
    const isApply = boardUser ? true : false;

    const posts = await Post.find({ board: board._id, deletedAt: null })
      .populate("creator")
      .lean();

    return { board, posts, isJoin, isApply };
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
