const bcrypt = require('bcryptjs');
const User = require('../../model/User/User');
const { appErr, AppErr } = require('../../utils/appErr');
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');

// Register
const userRegisterCtrl = async (req, res, next) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;
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
      profilePhoto,
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
const userLoginCtrl = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.json({
        msg: 'Invalid login Credentials',
      });
    }

    // verify password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password
    );

    if (!isPasswordMatched) {
      return res.json({
        msg: 'Invalid login Credentials',
      });
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
    res.json(error.message);
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
    res.json(error.message);
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
      const isUserAlreadyFollowed = userToFollow.following.find(
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
    res.json(error.message);
  }
};

// All
const getUsersCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'all Users route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

// Delete
const deleteUserCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'delete user route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updateUserCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'update user route',
    });
  } catch (error) {
    res.json(error.message);
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
};
