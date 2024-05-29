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
