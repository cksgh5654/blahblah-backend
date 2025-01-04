const generateOtp = (length) => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, "0");
};

const createHashedPassword = (password) => {
  return crypto.createHash("sha512").update(password).digest("base64");
};

module.exports = {
  generateOtp,
  createHashedPassword,
};
