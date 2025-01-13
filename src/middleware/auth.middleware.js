const { findUserByEmail } = require("../services/user.service");
const { verifyToken } = require("../utils/token");

const withAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ isError: true, message: "토큰이 필요합니다." });
  }
  try {
    const { userId, email } = verifyToken(token);
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 정보 요청 입니다." });
    }
    req.userId = userId;
    req.email = email;
    req.role = user.role;
    next();
  } catch (error) {
    console.log(error);
    const { name } = error;
    if (name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ isError: true, message: "토큰이 만료되었습니다." });
    }

    if (name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ isError: true, message: "토큰이 올바르지 않습니다." });
    }

    return res
      .status(500)
      .json({ isError: false, message: "토큰을 가져오지 못했습니다." });
  }
};

const onlyAdmin = async (req, res, next) => {
  const role = req.role;

  if (role !== "ADMIN") {
    return res
      .status(401)
      .json({ isError: true, message: "접근 권한이 부족합니다." });
  }

  next();
};

module.exports = {
  withAuth,
  onlyAdmin,
};
