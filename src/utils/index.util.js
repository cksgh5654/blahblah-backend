const crypto = require("crypto");

const createOtp = (length) => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");
};

const createHashedPassword = (password) => {
  return crypto.createHash("sha512").update(password).digest("base64");
};

const removeUndefinedFields = (object) => {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] !== undefined) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
};

module.exports = {
  createOtp,
  createHashedPassword,
  removeUndefinedFields,
};
