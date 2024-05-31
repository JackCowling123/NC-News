const {selectTopics, selectArticleByID, selectAllArticles, selectCommentsByArticle, insertCommentByArticle, updateArticle,deleteComment} = require('../models/models.js')
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
    const { article_id } = req.params;
    const newComment = req.body;
    const articleIdParsed = parseInt(article_id, 10);


    insertCommentByArticle(articleIdParsed, newComment)
        .then((result) => {
            const addedComment = result[0];
            res.status(201).send(addedComment);
        })
        .catch((err) => {
            next(err);
        });
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.body.inc_votes, req.params.article_id)
        .then((returnedArticle) => {
            res.status(200).send(returnedArticle);
        })
        .catch((err) => {
            next(err);
        });
}

exports.handleDeleteComment = (req, res, next) => {
    deleteComment(req.params.comment_id)
        .then((deletedResult) => {
            if (deletedResult.rowCount === 0) {
                const err = new Error('Invalid input');
                err.status = 404;
                err.msg = 'Invalid input';
                next(err);
            } else {
                res.status(204).send();
            }

        })
        .catch((err) => {
            next(err);
        });

}