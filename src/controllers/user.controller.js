const { withAuth } = require("../middleware/auth.middleware");
const {
  findUserByEmail,
  findUserByNickname,
} = require("../services/user.service");
const userController = require("express").Router();

userController.get("/me", withAuth, async (req, res) => {
  try {
    const user = await findUserByEmail(req.email);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 유저 정보 요청입니다." });
    }
    return res.status(200).json({ isError: false, user });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보를 가져오는데 실패했습니다." });
  }
});

userController.get("/profile", async (req, res) => {
  try {
    const { nickname: query } = req.query;
    const nickname = query.replace("@", "");
    const user = await findUserByNickname(nickname);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 유저 정보 요청입니다." });
    }
    return res.status(200).json({ isError: false, user });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보를 가져오는데 실패했습니다." });
  }
});

module.exports = userController;
