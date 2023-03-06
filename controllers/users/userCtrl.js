const bcrypt = require('bcryptjs');
const User = require('../../model/User/User');
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/getTokenFromHeader');

// Register
const userRegisterCtrl = async (req, res, next) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;
  try {
    // Check if email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(new Error('User already registered'));
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
    next(new Error(error.message));
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
      return next();
    }

    // 3.Check if the user is blocked
    // 4.Check if the user is updating their profile photo
    // 5.Update profile photo
    res.json({
      status: 'success',
      data: 'Profile Photo Upload',
    });
  } catch (error) {
    res.json(error.message);
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
};
