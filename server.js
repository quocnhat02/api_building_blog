const express = require('express');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const categoryRouter = require('./routes/categories/categoryRoutes');
const commentRouter = require('./routes/comments/commentRoutes');
const postRouter = require('./routes/posts/postRoutes');
const userRouter = require('./routes/users/userRoutes');

require('dotenv').config();
require('./config/dbConnect');

const app = express();

// middleware
app.use(express.json()); // passing incoming payload
app.use(express.urlencoded({ extended: true }));

// -------
// routes

// users route
app.use('/api/v1/users/', userRouter);
// posts route
app.use('/api/v1/posts/', postRouter);
// comments route
app.use('/api/v1/comments/', commentRouter);
// categories route
app.use('/api/v1/categories/', categoryRouter);
// -------

// Error handlers middleware
app.use(globalErrorHandler);

// 404 error
app.use('*', (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} - Route not found` });
});

// Listen to server
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
