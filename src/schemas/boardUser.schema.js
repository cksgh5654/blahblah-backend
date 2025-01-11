const mongoose = require("../../mongodb_init");
const { ObjectId, Boolean, Date } = mongoose.Schema.Types;

const boardUser = new mongoose.Schema(
  {
    board: {
      type: ObjectId,
      ref: "boards",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    joinedStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
  }
);

const BoardUser = mongoose.model("boardusers", boardUser);
module.exports = BoardUser;
