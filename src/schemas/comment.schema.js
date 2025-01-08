const mongoose = require('../../mongodb_init');
const { String, ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: ObjectId,
      required: true,
      ref: 'Post',
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

const Comment = mongoose.model('Comments', commentSchema);
module.exports = Comment;
