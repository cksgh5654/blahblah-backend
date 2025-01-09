const BoardUser = require("../schemas/boardUser.schema");
const { removeUndefinedFields } = require("../utils/index.util");

const getBoardUsersById = async (boardId, { limit = 10, page }) => {
  const skip = (page - 1) * limit;
  try {
    const users = await BoardUser.find({ board: boardId, deletedAt: null }) //
      .populate("user")
      .skip(skip)
      .limit(limit)
      .lean();
    return users;
  } catch (error) {
    throw new Error(`[DB Error] getBoardUsersById`, { cause: error });
  }
};

const getBoardUsersCount = async (boardId) => {
  try {
    return await BoardUser.find({
      board: boardId,
      deletedAt: null,
    }).countDocuments();
  } catch (error) {
    throw new Error(`[DB Error] getBoardUsersCount`, { cause: error });
  }
};

const updateBoardUser = async (
  boardId,
  userId,
  { deletedAt, joinedStatus }
) => {
  const filterdObject = removeUndefinedFields({ deletedAt, joinedStatus });
  try {
    const user = await BoardUser.findOneAndUpdate(
      {
        board: boardId,
        user: userId,
      },
      filterdObject
    );
    return user;
  } catch (error) {
    throw new Error(`[DB Error] updateBoardUser`, { cause: error });
  }
};

module.exports = {
  getBoardUsersById,
  getBoardUsersCount,
  updateBoardUser,
};
