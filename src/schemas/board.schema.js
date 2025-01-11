const mongoose = require("../../mongodb_init");
const { String, ObjectId, Number, Date } = mongoose.Schema.Types;

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    memberCount: {
      type: Number,
      required: true,
    },
    postCount: {
      type: Number,
      required: true,
    },
    manager: {
      type: ObjectId,
      required: true,
      ref: "users",
    },
    deletedAt: {
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

const Board = mongoose.model("boards", boardSchema);
module.exports = Board;
