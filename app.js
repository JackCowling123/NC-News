const express = require('express');
const app = express();
const {getTopics, getAPI, getArticlesID, getAllArticles, getCommentsByArticle, postCommentByArticle, patchArticle, handleDeleteComment, getAllUsers} = require('./controllers/controllers.js')
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getAPI);
app.get('/api/articles/:article_id', getArticlesID);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticle);
app.post('/api/articles/:article_id/comments', postCommentByArticle);
app.patch('/api/articles/:article_id', patchArticle);
app.delete('/api/comments/:comment_id', handleDeleteComment);
app.get('/api/users', getAllUsers);



// Middleware to catch 404 errors (route not found)
app.use((req, res, next) => {
    const err = new Error('Invalid input');
    err.status = 404;
    err.msg = 'Invalid input';
    next(err);
});

// Middleware to handle specific error codes
app.use((err, req, res, next) => {

    if (err.code === '22P02' || err.code === '23502' || err.code === '23503') {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        next(err);
    }
});

// General error handling
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
});



module.exports = app;