const mongoose = require('mongoose');

// Create schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, 'First Name is required'],
  },
  lastName: {
    type: String,
    require: [true, 'Last Name is required'],
  },
  profilePhoto: {
    type: String,
  },
  email: {
    type: String,
    require: [true, 'Email is required'],
  },
  password: {
    type: String,
    require: [true, 'Password is required'],
  },
  postCount: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['Admin', 'Guest', 'Editor'],
  },
  viewedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});
