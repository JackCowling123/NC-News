const {selectTopics, selectArticleByID} = require('../models/models.js')
const endpointsJson = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({topics: topics});
        })
        .catch((err) => {
            next(err);
        });
}

exports.getAPI = (req, res, next) => {
    const myEndpoints = {...endpointsJson};
    res.status(200).send(myEndpoints);
}

exports.getArticlesID = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleByID(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next);
}