const config = require("../../consts");
const axios = require("axios");
const {
  findUserByEmail,
  createUser,
  updateUserById,
} = require("../services/user.service");
const { createToken, verifyToken } = require("../utils/token");
const { createOtp, createHashedPassword } = require("../utils/index.util");
const {
  findTempUserByEmail,
  createTempUser,
  findTempUserById,
} = require("../services/tempUser.service");
const {
  sendMailForSignup,
  sendMailForResetPassword,
} = require("../utils/nodemailer.util");
const authController = require("express").Router();

authController.get("/google-entry-url", (_req, res) => {
  res.redirect(config.google.oauthEntryUrl);
});

authController.get("/google-oauth-redirect", async (req, res) => {
  const { code } = req.query;
  try {
    const url = `https://oauth2.googleapis.com/token`;
    const requestToken = await axios.post(url, {
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: config.google.redirectUrl,
      grant_type: "authorization_code",
    });
    const { access_token } = requestToken.data;
    const request = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (request.data) {
      const { email, picture: image } = request.data;
      let user = await findUserByEmail(email);

      if (!user) {
        const nickname = email.split("@")[0];
        user = await createUser({ email, nickname, image });
      } else {
        if (user.deletedAt !== null) {
          return res.redirect(
            `${config.app.frontEndPoint}/signin?errorMessage=이미탈퇴한사용자입니다.`
          );
        }
      }

      const token = createToken({ email, userId: user._id });
      res.cookie("token", token, {
        maxAge: 60 * 1000 * 1000,
        httpOnly: true,
        path: "/",
      });
      res.redirect(config.app.frontEndPoint);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "구글 계정 연결에 실패했습니다." });
  }
});

authController.post("/signup/otp", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ isError: true, message: "이메일이 필요합니다." });
  }
  if (!password) {
    return res
      .status(400)
      .json({ isError: true, message: "비밀번호가 필요합니다." });
  }

  try {
    const user = await findUserByEmail(email);

    if (user) {
      if (user.deletedAt !== null) {
        return res
          .status(400)
          .json({ isError: false, message: "이미 탈퇴한 계정 입니다." });
      }

      return res
        .status(400)
        .json({ isError: true, message: "이미 가입된 이메일 계정 입니다." });
    }

    let tempUser = await findTempUserByEmail(email);
    const otp = createOtp(6);
    const hashedPassword = createHashedPassword(password);
    if (!tempUser) {
      tempUser = await createTempUser({ email, password: hashedPassword, otp });
    }
    await sendMailForSignup(email, otp);

    const otpToken = createToken({
      email,
      userId: tempUser._id,
      expires: 1000 * 60 * 5,
    });
    res.cookie("otpToken", otpToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      path: "/",
    });

    return res.status(200).json({
      isError: false,
      message: "이메일 회원가입 otp 요청에 성공 했습니다.",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "이메일 OTP 요청에 실패 했습니다." });
  }
});

authController.post("/signup/otp/verify", async (req, res) => {
  const { otpToken } = req.cookies;
  if (!otpToken) {
    return res
      .status(400)
      .json({ isError: true, message: "쿠키가 만료되었습니다." });
  }

  const { otp } = req.body;
  if (!otp) {
    return res
      .status(400)
      .json({ isError: true, message: "otp 번호가 필요합니다." });
  }

  const { userId } = verifyToken(otpToken);
  try {
    const tempUser = await findTempUserById(userId);
    if (!tempUser) {
      return res
        .status(400)
        .json({ isError: true, message: "유효하지 않은 OTP 요청입니다." });
    }
    if (otp !== tempUser.otp) {
      return res
        .status(400)
        .json({ isError: false, message: "otp 정보가 잘못 되었습니다." });
    }

    await createUser({
      email: tempUser.email,
      password: tempUser.password,
      nickname: tempUser.email.split("@")[0],
    });

    return res
      .status(201)
      .json({ isError: false, message: "회원가입에 성공 하였습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "otp 인증에 실패했습니다." });
  }
});

authController.post("/signin/email", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ isError: true, message: "이메일이 필요합니다." });
  }
  if (!password) {
    return res
      .status(400)
      .json({ isError: true, message: "페스워드가 필요합니다." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 정보 요청 입니다." });
    } else {
      if (user.deletedAt !== null) {
        return res
          .status(400)
          .json({ isError: true, message: "이미 탈퇴한 계정 입니다." });
      }
    }

    const hashedPassword = createHashedPassword(password);
    const { password: pwFromDB, _id, ...rest } = user;
    if (hashedPassword !== pwFromDB) {
      return res.status(400).json({
        isError: true,
        message: "이메일 또는 패스워드가 잘못되었습니다.",
      });
    }
    const token = createToken({ email, userId: _id });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    return res.status(200).json({ isError: false, user: { ...rest } });
  } catch (error) {
    console.log(error);
  }
});

authController.post("/password-reset/otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ isError: true, message: "이메일이 필요합니다." });
  }

  try {
    const user = await findUserByEmail(email);
    if (user.deletedAt !== null) {
      return res
        .status(400)
        .json({ isError: true, message: "이미 탈퇴한 계정 입니다." });
    }
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 정보 요청 입니다." });
    }

    const otp = createOtp(6);
    let tempUser = await findTempUserByEmail(email);
    if (!tempUser) {
      tempUser = await createTempUser({ email, otp });
    }
    await sendMailForResetPassword(email, otp);

    const otpToken = createToken({
      email,
      userId: user._id,
      expires: 1000 * 60 * 5,
    });
    res.cookie("otpToken", otpToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      path: "/",
    });

    return res
      .status(200)
      .json({ isError: false, message: "otp요청에 성공했습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "otp요청에 실패했습니다." });
  }
});

authController.post("/password-reset/otp/verify", async (req, res) => {
  const { otpToken } = req.cookies;
  if (!otpToken) {
    return res
      .status(400)
      .json({ isError: true, message: "쿠키가 만료되었습니다." });
  }

  const { password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ isError: true, message: "패스워드 정보가 필요합니다." });
  }

  const { otp } = req.body;
  if (!otp) {
    return res
      .status(400)
      .json({ isError: true, message: "otp 번호가 필요합니다." });
  }

  const { email, userId } = verifyToken(otpToken);
  try {
    const tempUser = await findTempUserByEmail(email);
    if (!tempUser) {
      return res
        .status(400)
        .json({ isError: true, message: "유효하지 않은 OTP 요청입니다." });
    }
    if (otp !== tempUser.otp) {
      return res
        .status(400)
        .json({ isError: false, message: "otp 정보가 잘못 되었습니다." });
    }
    const hashedPassword = createHashedPassword(password);
    await updateUserById(userId, { password: hashedPassword });
    return res
      .status(200)
      .json({ isError: false, message: "비밀번호 재설정을 완료하였습니다." });
  } catch (error) {
    console.log(error);
  }
});

authController.post("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ isError: false, message: "로그아웃 완료" });
  } catch (error) {
    console.log(error);
  }
});

authController.get("/signin-status", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(200)
        .json({ isError: false, data: { user: {}, signinStatus: false } });
    }
    const { email } = verifyToken(token);
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 정보 요청 입니다." });
    }
    return res
      .status(200)
      .json({ isError: false, data: { user, signinStatus: true } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "상태 확인중 에러가 발생했습니다." });
  }
});

module.exports = authController;
