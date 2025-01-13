const mongoose = require("../../mongodb_init");
const { String, Date } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    nickname: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
