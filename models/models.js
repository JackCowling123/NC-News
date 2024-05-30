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

exports.selectAllArticles = () => {
    return db
        .query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
        .then((result) => {
            return result.rows;
        })
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
