const mongoose = require("../../mongodb_init");
const { String, ObjectId } = mongoose.Schema.Types;

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
    imgUrl: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    manager: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const Board = mongoose.model("Boards", boardSchema);
module.exports = Board;
