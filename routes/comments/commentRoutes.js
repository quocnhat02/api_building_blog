const express = require('express');
const {
  createCommentCtrl,
  getCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require('../../controllers/comments/commentCtrl');

const commentRouter = express.Router();

// POST/api/v1/comments
commentRouter.post('/', createCommentCtrl);

// GET/api/v1/comments/:id
commentRouter.get('/:id', getCommentCtrl);

// DELETE/api/v1/comments/:id
commentRouter.delete('/:id', deleteCommentCtrl);

// PUT/api/v1/comments/:id
commentRouter.put('/:id', updateCommentCtrl);

module.exports = commentRouter;
