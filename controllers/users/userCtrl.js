const bcrypt = require('bcryptjs');
const Category = require('../../model/Category/Category');
const Comment = require('../../model/Comment/Comment');
const User = require('../../model/User/User');
const Post = require('../../model/Post/Post');
const { appErr, AppErr } = require('../../utils/appErr');
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');

// Register
const userRegisterCtrl = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(new AppErr('User already registered', 500));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// Login
const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if email exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appErr('Invalid login Credentials'));
    }

    // verify password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password
    );

    if (!isPasswordMatched) {
      return next(appErr('Invalid login Credentials'));
    }

    res.json({
      status: 'success',
      data: {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Who viewed my profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
  try {
    // 1. Find the original
    const user = await User.findById(req.params.id);

    // 2.Find the user who viewed the original user
    const userWhoViewed = await User.findById(req.userAuth);

    // 3.Check the original and who view were found
    if (user && userWhoViewed) {
      //4.Check if userWhoViewed is already in the users viewers array
      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toJSON()
      );

      if (isUserAlreadyViewed) {
        return next(appErr('You already viewed this profile'));
      } else {
        // 5.Push the userWhoViewed to the user's viewers array
        user.viewers.push(userWhoViewed._id);
        // 6.Save the user
        await user.save();

        res.json({
          status: 'success',
          data: 'You have successfully viewed this profile',
        });
      }
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Profile
const userProfileCtrl = async (req, res) => {
  try {
    const user = await User.findById(req.userAuth);

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.json(error.message);
  }
};

// Following
const followingCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to follow
    const userToFollow = await User.findById(req.params.id);

    // 2.Find the user who is following
    const userWhoFollowed = await User.findById(req.userAuth);

    // 3.Check if the user and userWhoFollowed are found
    if (userToFollow && userWhoFollowed) {
      // 4.Check if userWhoFollowed is already in the user's followers array
      const isUserAlreadyFollowed = userToFollow.followers.find(
        (follower) => follower.toString() === userWhoFollowed._id.toString()
      );

      if (isUserAlreadyFollowed) {
        return next(appErr('You already follow this user'));
      } else {
        // 5.Push userToFollow into the user's followers array
        userToFollow.followers.push(userWhoFollowed._id);

        // push userToFollow to the userWhoFollowed's followers array
        userWhoFollowed.following.push(userToFollow._id);

        // save
        await userWhoFollowed.save();
        await userToFollow.save();

        res.json({
          status: 'success',
          data: 'You have successfully followed this user',
        });
      }
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// UnFollow
const unFollowingCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to unfollow
    const userToBeUnFollowed = await User.findById(req.params.id);

    // 2.Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.userAuth);

    // 3.Check if the user is and userWhoUnFollowed are found
    if (userToBeUnFollowed && userWhoUnFollowed) {
      // 4.Check if userWhoUnFollowed is already in the user's followers array
      const isUserAlreadyFollowed = userToBeUnFollowed.followers.find(
        (follower) => follower.toString() === userWhoUnFollowed._id.toString()
      );

      if (!isUserAlreadyFollowed) {
        return next(appErr('You have not followed this user'));
      } else {
        // 5.Remove userWhoUnFollowed from the user's followers array
        userToBeUnFollowed.followers = userToBeUnFollowed.followers.filter(
          (follower) => follower.toString() !== userWhoUnFollowed._id.toString()
        );

        // 6.save the user
        await userToBeUnFollowed.save();

        // 7.Remove userToBeFollowed from the userWhoUnFollowed's followers array
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (following) =>
            following.toString() !== userToBeUnFollowed._id.toString()
        );

        // 8.save the user
        await userWhoUnFollowed.save();

        res.json({
          status: 'success',
          data: 'You have successfully unfollowed this user',
        });
      }
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// block
const blockUsersCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);

    // 2.Find the user who is blocking
    const userWhoBlocked = await User.findById(req.userAuth);

    // 3.Check if the userToBeBlocked userWhoBlocked are found
    if (userToBeBlocked && userWhoBlocked) {
      // 4.Check if userWhoBlocked is already in the user's blocked array
      const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeBlocked._id.toString()
      );

      if (isUserAlreadyBlocked) {
        return next(appErr('You already blocked this user'));
      }

      // 5.Push userToBeBlocked to the userWhoBlocked's blocked array
      userWhoBlocked.blocked.push(userToBeBlocked._id);

      // 6.save
      await userWhoBlocked.save();

      res.json({
        status: 'success',
        data: 'You have successfully blocked this user',
      });
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// unBlock
const unblockUsersCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);

    // 2.Find the user who is unblocking
    const userWhoUnBlocked = await User.findById(req.userAuth);

    // 3.Check if userToBeUnBlocked and userWhoUnBlocked are found
    if (userToBeUnBlocked && userWhoUnBlocked) {
      // 4. Check if userToBeUnBlocked is already in the array's of userWhoUnBlocked
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeUnBlocked._id.toString()
      );

      if (!isUserAlreadyBlocked) {
        return next(appErr('You have not blocked this user'));
      }

      // 5.Remove userToBeUnBlocked from userWhoUnBlocked's array
      userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
        (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
      );

      // 6.Save
      await userWhoUnBlocked.save();

      res.json({
        status: 'success',
        data: 'You have successfully unblocked this user',
      });
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Admin-block
const adminBlockUserCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);

    // 2.Check if the user found
    if (!userToBeBlocked) {
      return next(appErr('User not found'));
    }

    // 3.Check if the user has been blocked
    if (userToBeBlocked.isBlocked) {
      return next(appErr('User has been blocked'));
    }

    // 4.Change the isBlocked to true
    userToBeBlocked.isBlocked = true;

    // 5.save
    await userToBeBlocked.save();

    res.json({
      status: 'success',
      data: 'You have successfully blocked the user',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Admin-unblock
const adminUnblockUserCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be unblocked
    const userToBeUnblocked = await User.findById(req.params.id);

    // 2.Check if the user found
    if (!userToBeUnblocked) {
      return next(appErr('User not found'));
    }

    // 3.Check if the user has been blocked
    if (!userToBeUnblocked.isBlocked) {
      return next(appErr('User has not been blocked'));
    }

    // 4.Change the isBlocked to false
    userToBeUnblocked.isBlocked = false;

    // 5.save
    await userToBeUnblocked.save();

    res.json({
      status: 'success',
      data: 'You have successfully unblocked the user',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// All
const getUsersCtrl = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be deleted
    const userToBeDelete = await User.findById(req.userAuth);

    if (!userToBeDelete) {
      return next(appErr('User not found'));
    }

    // 2.Find all posts to be deleted
    await Post.deleteMany({ user: req.userAuth });

    // 3.Delete all comments of the user
    await Comment.deleteMany({ user: req.userAuth });

    // 4.Delete all categories of the user
    await Category.deleteMany({ user: req.userAuth });

    // 5.delete
    await User.deleteOne({ user: userToBeDelete });

    // send response
    res.json({
      status: 'success',
      data: 'You have successfully deleted',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Update
const updateUserCtrl = async (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  try {
    // 1.Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });

      if (emailTaken) {
        return next(appErr('Email is taken', 400));
      }
    }

    // 2.Update the user
    const user = await User.findByIdAndUpdate(
      req.userAuth,
      {
        lastName,
        firstName,
        email,
      },
      { new: true, runValidators: true }
    );

    // 3.Send response
    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Update password
const updatePasswordUserCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // update user
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          password: hashedPassword,
        },
        { new: true, runValidators: true }
      );

      res.json({
        status: 'success',
        data: 'Password has been updated successfully',
      });
    } else {
      return next(appErr('Please provide password field'));
    }
  } catch (error) {
    return next(appErr(error.message));
  }
};

// Profile Photo Upload
const profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    // 1.Find the user to be updated
    const userToUpdate = await User.findById(req.userAuth);

    // 2.Check if the user is found
    if (!userToUpdate) {
      return next(appErr('User not found', 404));
    }

    // 3.Check if the user is blocked
    if (userToUpdate.isBlocked) {
      return next(appErr('Action not allowed', 403));
    }

    // 4.Check if the user is updating their profile photo
    if (req.file) {
      // 5.Update profile photo
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        { new: true }
      );

      res.json({
        status: 'success',
        data: 'You have successfully updated your profile photo',
      });
    }
  } catch (error) {
    next(appErr(error.message, 500));
  }
};
module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userProfileCtrl,
  getUsersCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  profilePhotoUploadCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowingCtrl,
  blockUsersCtrl,
  unblockUsersCtrl,
  adminBlockUserCtrl,
  adminUnblockUserCtrl,
  updatePasswordUserCtrl,
};
