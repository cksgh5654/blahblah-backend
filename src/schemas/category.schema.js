const mongoose = require('../../mongodb_init');
const { String } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Category = mongoose.model('categorys', categorySchema);
module.exports = Category;
