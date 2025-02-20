const TempUser = require("../schemas/tempUser.schema");

const createTempUser = async ({ email, password, otp }) => {
  try {
    const user = await TempUser.create({ email, password, otp });
    return user;
  } catch (error) {
    throw new Error("[DB Error] createTempUser", { cause: error });
  }
};

const findTempUserById = async (id) => {
  try {
    const user = await TempUser.findById(id);
    return user;
  } catch (error) {
    throw new Error("[DB Error] createTempUser", { cause: error });
  }
};

const findTempUserByEmail = async (email) => {
  try {
    const user = await TempUser.findOne({ email }).lean();
    return user;
  } catch (error) {
    throw new Error("[DB Error] findTempUserByEmail", { cause: error });
  }
};

module.exports = {
  findTempUserByEmail,
  findTempUserById,
  createTempUser,
};
