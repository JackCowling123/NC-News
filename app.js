const express = require('express');
const app = express();
const {getTopics, getAPI} = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);
app.get('/api', getAPI);


// Middleware to catch errors
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

//Error Handling middleware
app.use((err, req, res, next) => {
    console.log(err);

    if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad request' });
    } else if (err.status === 404) {
        res.status(404).send({ msg: 'Invalid input' });
    }
});

module.exports = app;