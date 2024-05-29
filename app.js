const express = require('express');
const app = express();
const {getTopics, getAPI, getArticlesID} = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);
app.get('/api', getAPI);
app.get('/api/articles/:article_id', getArticlesID);


// Middleware to catch 404 errors (route not found)
app.use((req, res, next) => {
    const err = new Error('Invalid input');
    err.status = 404;
    err.msg = 'Invalid input';
    next(err);
});

// Middleware to handle specific Postgres error codes
app.use((err, req, res, next) => {
    console.log(err);
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        next(err);
    }
});

// General error handling middleware for known errors with status and message
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});



module.exports = app;