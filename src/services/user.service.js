const User = require("../schemas/user.schema");

const createUser = async ({ email, name, image }) => {
  try {
    const user = User.create({ email, name, image });
    return user;
  } catch (error) {
    throw new Error("[DB Error] createUser", { cause: error });
  }
};

const findUserByEmail = async ({ email }) => {
  try {
    const user = await User.findOne({ email }).lean();
    return user;
  } catch (error) {
    throw new Error("[DB Error] findUserByEmail", { cause: error });
  }
};

module.exports = {
  createUser,
  findUserByEmail,
};
