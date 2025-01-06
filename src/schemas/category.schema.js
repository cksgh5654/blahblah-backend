const mongoose = require("../../mongodb_init");
const { String } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const Category = mongoose.model("Categorys", categorySchema);
module.exports = Category;
