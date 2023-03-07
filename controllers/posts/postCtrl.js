const Post = require('../../model/Post/Post');
const User = require('../../model/User/User');

// Create post
const createPostCtrl = async (req, res) => {
  const { title, description } = req.body;
  try {
    // 1.Find the user
    const author = await User.findById(req.userAuth);

    // 2.Create the post
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
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
    res.json(error.message);
  }
};

const getPostCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'Post route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getPostsCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'Posts route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deletePostCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'delete post route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updatePostCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'update post route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createPostCtrl,
  getPostCtrl,
  getPostsCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
