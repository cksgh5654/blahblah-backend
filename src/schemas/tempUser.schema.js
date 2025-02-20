const mongoose = require("../../mongodb_init");
const { String } = mongoose.Schema.Types;

const tempUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date,
    expires: 300,
  },
});

const TempUser = mongoose.model("tempusers", tempUserSchema);
module.exports = TempUser;
