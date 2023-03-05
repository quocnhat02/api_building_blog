const createPostCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'post created',
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
