const {selectTopics, selectArticleByID, selectAllArticles, selectCommentsByArticle, sendCommentByArticle} = require('../models/models.js')
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

exports.getAllArticles = (req, res, next) => {
    console.log('controller');
    selectAllArticles()
        .then((allArticles) => {
            res.status(200).send({allArticles: allArticles});
        })
        .catch((err) => {
            next(err);
        });
}

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticle(article_id)
        .then((articleComments) => {
            res.status(200).send(articleComments);
        })
        .catch((err) => {
            next(err);
        });
}

exports.postCommentByArticle = (req, res, next) => {
    console.log('controllers');
    const { article_id } = req.params;
    sendCommentByArticle(article_id)
        .then(() => {

        })
}