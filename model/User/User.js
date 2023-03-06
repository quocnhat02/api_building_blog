const mongoose = require('mongoose');

// Create schema
const userSchema = new mongoose.Schema(
  {
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
    viewers: [
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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    plan: [
      {
        type: String,
        enum: ['Free', 'Premium', 'Pro'],
        default: 'Free',
      },
    ],
    userAward: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      default: 'Bronze',
    },
  },
  { timestamps: true }
);

// Compile the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
