const createCategoryCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'category created',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getCategoryCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'Category route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'delete category route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updateCategoryCtrl = async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: 'update categories route',
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createCategoryCtrl,
  getCategoryCtrl,
  deleteCategory,
  updateCategoryCtrl,
};
