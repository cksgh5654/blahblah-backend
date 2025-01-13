const { removeUndefinedFields } = require("../utils/index.util");
const User = require("../schemas/user.schema");

const createUser = async ({ email, password, nickname, image }) => {
  try {
    const user = User.create({ email, nickname, password, image });
    return user;
  } catch (error) {
    throw new Error("[DB Error] createUser", { cause: error });
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).lean();
    return user;
  } catch (error) {
    throw new Error("[DB Error] findUserByEmail", { cause: error });
  }
};

const findUserByNickname = async (nickname) => {
  try {
    const user = await User.findOne(
      { nickname },
      "email nickname image createdAt -_id"
    ).lean();
    return user;
  } catch (error) {
    throw new Error("[DB Error] findUserByNickname", { cause: error });
  }
};

const updateUserById = async (id, { email, nickname, image, password }) => {
  const filterdObject = removeUndefinedFields({
    email,
    nickname,
    image,
    password,
  });
  try {
    const user = await User.findByIdAndUpdate(id, filterdObject);
    return user;
  } catch (error) {
    throw new Error("[DB Error] updateUserById", { cause: error });
  }
};

const getUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  try {
    const users = await User.find({ role: "USER", deletedAt: null }) //
      .skip(skip)
      .limit(limit)
      .lean();
    return users;
  } catch (error) {
    throw new Error(`[DB에러] getUsers`, { cause: error });
  }
};

const getTotalUsersCount = async () => {
  try {
    return await User.find({ role: "USER", deletedAt: null }).countDocuments();
  } catch (error) {
    throw new Error(`[DB에러] getTotalUsersCount`, { cause: error });
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { deletedAt: Date.now() }
    );
    return user;
  } catch (error) {
    throw new Error(`[DB에러 deleteUser]`, { cause: error });
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByNickname,
  updateUserById,
  getUsers,
  getTotalUsersCount,
  deleteUser,
};
