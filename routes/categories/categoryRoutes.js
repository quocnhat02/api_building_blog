const express = require('express');
const {
  createCategoryCtrl,
  getCategoryCtrl,
  deleteCategoryCtrl,
  updateCategoryCtrl,
  getCategoriesCtrl,
} = require('../../controllers/categories/categoryCtrl');
const isLogin = require('../../middlewares/isLogin');

const categoryRouter = express.Router();

// POST/api/v1/categories
categoryRouter.post('/', isLogin, createCategoryCtrl);

// GET/api/v1/categories/:id
categoryRouter.get('/:id', getCategoryCtrl);

// GET/api/v1/categories/
categoryRouter.get('/', getCategoriesCtrl);

// DELETE/api/v1/categories/:id
categoryRouter.delete('/:id', deleteCategoryCtrl);

// PUT/api/v1/categories/:id
categoryRouter.put('/:id', isLogin, updateCategoryCtrl);

module.exports = categoryRouter;
