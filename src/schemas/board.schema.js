const mongoose = require("../../mongodb_init");
const { String, Number } = mongoose.Schema.Types;

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
    detailedDescription: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
      ref: "Category",
    },
    managerId: {
      type: String,
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
