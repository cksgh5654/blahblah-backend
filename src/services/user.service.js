const User = require("../schemas/user.schema");

const createUser = async ({ email, password, name, image }) => {
  try {
    const user = User.create({ email, name, password, image });
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

const updateUserById = async (id, { password }) => {
  try {
    const user = await User.findByIdAndUpdate(id, { password });
    return user;
  } catch (error) {
    throw new Error("[DB Error] updateUserById", { cause: error });
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserById,
};
