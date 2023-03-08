const Category = require('../../model/Category/Category');
const { appErr } = require('../../utils/appErr');

// create
const createCategoryCtrl = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.userAuth });

    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// single
const getCategoryCtrl = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// all
const getCategoriesCtrl = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// delete
const deleteCategoryCtrl = async (req, res, next) => {
  try {
    res.json({
      status: 'success',
      data: 'delete category route',
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// update
const updateCategoryCtrl = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        title,
      },
      { new: true, runValidators: true }
    );
    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCategoryCtrl,
  getCategoryCtrl,
  deleteCategoryCtrl,
  updateCategoryCtrl,
  getCategoriesCtrl,
};
