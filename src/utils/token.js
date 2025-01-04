const config = require("../../consts");
const jwt = require("jsonwebtoken");

const createToken = ({ email, userId }) => {
  return jwt.sign({ email, userId }, config.jwt.secretKey, {
    expiresIn: 1000 * 60 * 60,
  });
};

module.exports = {
  createToken,
};
