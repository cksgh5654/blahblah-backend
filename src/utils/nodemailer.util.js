const nodemailer = require("nodemailer");
const config = require("../../consts");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.nodemailer.authEmail,
    pass: config.nodemailer.authPass,
  },
});

const sendMailForSignup = async (email, otp) => {
  const mailOptions = {
    from: config.nodemailer.authEmail,
    to: email,
    subject: "Blahblah 회원가입 otp 요청입니다.",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color: #333;">${email} 회원가입 OTP 요청</h2>
              <p style="color: #555; font-size: 16px;">OTP를 입력하여 회원가입을 완료하세요.</p>
              <div style="margin: 20px 0; padding: 10px; font-size: 24px; font-weight: bold; color: #fff; background-color: #007BFF; border-radius: 5px; display: inline-block;">
              ${otp} 
              </div>
              <p style="color: #888; font-size: 14px;">5분간 유효합니다.</p>
          </div>`,
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`[NODEMAILDER 에러] sendMailForSignup`, { cause: error });
  }
};

module.exports = {
  sendMailForSignup,
};
