const mongoose = require('../../mongodb_init');
const { String, ObjectId, Date } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    post: {
      type: ObjectId,
      required: true,
      ref: 'posts',
    },
    content: {
      type: String,
      required: true,
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

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
