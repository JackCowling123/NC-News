const db = require('../db/index.js');

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows;
    })
}
