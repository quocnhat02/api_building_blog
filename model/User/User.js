const mongoose = require('mongoose');
const Post = require('../Post/Post');

// Create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
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
    // plan: {
    //   type: String,
    //   enum: ['Free', 'Premium', 'Pro'],
    //   default: 'Free',
    // },

    userAward: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      default: 'Bronze',
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Hooks
// pre-before record is saved
userSchema.pre('findOne', async function (next) {
  // get the user id
  const userId = this._conditions._id;
  // find the post created by the user
  const posts = await Post.find({ user: userId });
  // get the last post created by the user
  const lastPostCreated = posts[posts.length - 1];
  // get the last post date
  const lastPostDate = new Date(lastPostCreated.createdAt);
  // get the last post date in string format
  const lastPostDateString = lastPostDate.toDateString();
  // add virtual to the schema
  userSchema.virtual('lastPostDate').get(function () {
    return lastPostDateString;
  });

  // ------------------Check if user is inactive state for 30 days ----------------
  // get current date
  const currentDate = new Date();
  // get difference between current date and the last date
  const difference = currentDate - lastPostDate;
  // get the difference in days and return less than in days
  const differenceDays = difference / (1000 * 3600 * 24);

  if (differenceDays > 30) {
    // add virtual isInactive to the schema to check if user is inactive for 30 days
    userSchema.virtual('isInactive').get(function () {
      return true;
    });
    // find the user by ID and update
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
  } else {
    userSchema.virtual('isInactive').get(function () {
      return false;
    });
    // find the user by ID and update
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
  }

  next();
});
// post-after saving
// userSchema.post('save', function (next) {
//   next();
// });

// Get fullName
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Get user initials
userSchema.virtual('initials').get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`;
});

// Get posts count
userSchema.virtual('postsCount').get(function () {
  return this.posts.length;
});

// Get followers count
userSchema.virtual('followersCount').get(function () {
  return this.followers.length;
});

// Get following count
userSchema.virtual('followingCount').get(function () {
  return this.following.length;
});

// Get viewers count
userSchema.virtual('viewersCount').get(function () {
  return this.viewers.length;
});

// Get blocked count
userSchema.virtual('blockedCount').get(function () {
  return this.blocked.length;
});

// Compile the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
