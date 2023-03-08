const Post = require('../../model/Post/Post');
const User = require('../../model/User/User');
const { appErr } = require('../../utils/appErr');

// Create post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    // 1.Find the user
    console.log(req.userAuth);
    const author = await User.findById(req.userAuth);
    console.log(author.isBlocked);
    // check if the user is blocked
    if (author.isBlocked) {
      return next(appErr('Access denied, account is blocked', 403));
    }

    // 2.Create the post
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
      category,
    });

    // 3.Associate user to a post - Push the post into the user posts field
    author.posts.push(postCreated);

    // 4.save
    await author.save();

    res.json({
      status: 'success',
      data: postCreated,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const getPostCtrl = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: 'Post route',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const getPostsCtrl = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: 'Posts route',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const deletePostCtrl = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: 'delete post route',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const updatePostCtrl = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: 'update post route',
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

module.exports = {
  createPostCtrl,
  getPostCtrl,
  getPostsCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
