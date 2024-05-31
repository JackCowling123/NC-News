const db = require('../db/index.js');

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
}
exports.selectArticleByID = (article_id) => {
    return db
        .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
        .then((result) => {
            if(result.rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `No user found for user_id: ${article_id}`,
                });
            } else {
                return result.rows[0];
            }
        })
}

exports.selectAllArticles = (topic) => {
    let articleQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    let params = [];

    let topicQuery = false
    if(topic) {
        articleQuery = articleQuery.replace("GROUP BY", `WHERE articles.topic = $1 GROUP BY`);
        params.push(topic);
        topicQuery = true;
    }



    return db.query(articleQuery, params)
        .then((result) => {

            return {queryResult: result.rows, topicQuery: topicQuery};
        })
        .catch((err) => {
            throw err;
        });
}

exports.selectCommentsByArticle = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;', [article_id])
        .then((result) => {
            return result.rows;
    })
}

exports.insertCommentByArticle = (article_id, newComment) => {
    const commentUsername = newComment.username;
    const commentBody = newComment.body;

    return db.query(`
INSERT INTO comments (article_id, author, body, votes, created_at)
VALUES ($1, $2, $3, 0, NOW()) 
RETURNING *;`,
        [article_id, commentUsername, commentBody]
    ).then((result) => {
        return result.rows;
    }).catch((err) => {
        throw err;
    });
}

exports.updateArticle = (votes, articleId) => {

    return db.query(`
        UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;
    `, [votes, articleId])
        .then((result) => {
            return result.rows[0];
        })
        .catch((err) => {
            throw err;
        });
};

exports.deleteComment = (commentId) => {
    return db.query(`
        DELETE FROM comments WHERE comment_id = $1;
    `, [commentId])
}

exports.returnAllUsers = () => {
    return db.query('SELECT * FROM users')
        .then((result) => {
            return result.rows;
        }).catch((err) => {
            throw err;
        });
}