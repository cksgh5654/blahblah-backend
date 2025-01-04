const mongoose = require("../../mongodb_init");
const { String, Date } = mongoose.Schema.Types;

const tempUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const TempUser = mongoose.model("tempusers", tempUserSchema);
module.exports = TempUser;
