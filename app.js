const express = require('express');

const {getTopics} = require('./controllers/controllers.js')

const app = express();

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    console.log(err);
});

module.exports = app;