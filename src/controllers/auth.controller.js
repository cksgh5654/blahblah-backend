const config = require("../../consts");
const axios = require("axios");
const User = require("../schemas/user.schema");
const { findUserByEmail, createUser } = require("../services/user.service");
const { createToken } = require("../utils/token");
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
      const { email, name, picture: image } = request.data;
      let user = await findUserByEmail(email);
      if (!user) {
        user = await createUser({ email, name, image });
      }
      const token = createToken({ email, userId: user._id });
      res.cookie("token", token, {
        maxAge: 60 * 1000 * 1000,
        httpOnly: true,
        path: "/",
      });
      res.redirect("http://localhost:5173");
    }
    return res
      .status(500)
      .json({ isError: true, message: "구글 계정 연결에 실패했습니다." });
  } catch (error) {
    console.log(error);
  }
});

module.exports = authController;
