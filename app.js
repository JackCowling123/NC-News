const express = require('express');

const {getTopics, getAPI} = require('./controllers/controllers.js')

const app = express();


app.get('/api/topics', getTopics);
app.get('/api', getAPI);


app.use((err, req, res, next) => {
    console.log(err);
    if(err.code === '42P01'){
        res.status(400).send({ msg: '400 Bad Request' });
    }

});

module.exports = app;