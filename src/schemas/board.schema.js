const mongoose = require("../../mongodb_init");
const { String, ObjectId } = mongoose.Schema.Types;

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
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
    manager: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    deleteAt: {
      type: String,
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

const Board = mongoose.model("Boards", boardSchema);
module.exports = Board;
