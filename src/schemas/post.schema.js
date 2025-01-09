const mongoose = require('../../mongodb_init');
const { String, ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    board: {
      type: ObjectId,
      required: true,
      ref: 'Boards',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
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

const Post = mongoose.model('Posts', postSchema);
module.exports = Post;
