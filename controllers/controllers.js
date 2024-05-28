const {selectTopics, selectAPIs} = require('../models/models.js')
const endpointsJson = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send(topics);
        })
        .catch((err) => {
            next(err);
        });
}

exports.getAPI = (req, res, next) => {
    res.status(200).send(endpointsJson);
}