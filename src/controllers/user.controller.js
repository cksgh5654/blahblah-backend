const { withAuth } = require("../middleware/auth.middleware");
const {
  findUserByEmail,
  findUserByNickname,
  updateUserById,
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
    const { email } = req.query;
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 유저 정보 요청입니다." });
    }
    return res.status(200).json({ isError: false, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보를 가져오는데 실패했습니다." });
  }
});

userController.put("/me", withAuth, async (req, res) => {
  const { email, nickname, image } = req.body;
  try {
    const user = await updateUserById(req.userId, { email, nickname, image });
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 유저 정보 요청입니다." });
    }
    return res
      .status(200)
      .json({ isError: false, message: "프로필 수정을 완료했습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보를 가져오는데 실패했습니다." });
  }
});

module.exports = userController;
