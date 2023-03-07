const express = require('express');
const storage = require('../../config/cloudinary');
const {
  userRegisterCtrl,
  userLoginCtrl,
  getUsersCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  profilePhotoUploadCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowingCtrl,
  blockUsersCtrl,
  unblockUsersCtrl,
  adminBlockUserCtrl,
} = require('../../controllers/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');

const userRouter = express.Router();

// instance of multer
const upload = multer({ storage });

// POST/api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

// POST/api/v1/users/login
userRouter.post('/login', userLoginCtrl);

// GET/api/v1/users/profile/:id
userRouter.get('/profile', isLogin, userProfileCtrl);

// GET/api/v1/users
userRouter.get('/', getUsersCtrl);

// DELETE/api/v1/users/:id
userRouter.delete('/:id', deleteUserCtrl);

// PUT/api/v1/users/:id
userRouter.put('/:id', updateUserCtrl);

// GET/api/v1/users/profile-viewers/:id
userRouter.get('/profile-viewers/:id', isLogin, whoViewedMyProfileCtrl);

// GET/api/v1/users/following/:id
userRouter.get('/following/:id', isLogin, followingCtrl);

// GET/api/v1/users/unfollow/:id
userRouter.get('/unfollowing/:id', isLogin, unFollowingCtrl);

// GET/api/v1/users/block/:id
userRouter.get('/block/:id', isLogin, blockUsersCtrl);

// GET/api/v1/users/unblock/:id
userRouter.get('/unblock/:id', isLogin, unblockUsersCtrl);

// GET/api/v1/users/admin-block/:id
userRouter.get('/admin-block/:id', isLogin, adminBlockUserCtrl);

// POST/api/v1/users/profile-photo-upload
userRouter.post(
  '/profile-photo-upload',
  isLogin,
  upload.single('profile'),
  profilePhotoUploadCtrl
);

module.exports = userRouter;
