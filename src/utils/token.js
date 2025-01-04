const config = require("../../consts");
const jwt = require("jsonwebtoken");

const createToken = ({ email, userId, expires = 1000 * 60 * 60 }) => {
  return jwt.sign({ email, userId }, config.jwt.secretKey, {
    expiresIn: expires,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secretKey);
};

module.exports = {
  createToken,
  verifyToken,
};
