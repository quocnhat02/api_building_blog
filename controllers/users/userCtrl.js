const bcrypt = require('bcryptjs');
const User = require('../../model/User/User');

// Register
const userRegisterCtrl = async (req, res) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;
  try {
    // Check if email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.json({
        msg: 'User Already Exist',
      });
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
    res.json(error.message);
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
      data: userFound,
    });
  } catch (error) {
    res.json(error.message);
  }
};

// Profile
const userProfileCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'Profile route',
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

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userProfileCtrl,
  getUsersCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
