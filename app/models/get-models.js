const db = require('../../db/connection')

exports.fetchTopics = () => {
    return db.query(`
    SELECT * FROM topics;
    `).then(({ rows }) => {
        return rows
    })
}

exports.fetchUsers = () => {
    return db.query(`
    SELECT username FROM users;
    `).then(({ rows }) => {
        return rows
    })
}

exports.fetchArticles = (sort_by = 'created_at', order = 'desc', topic = undefined) => {
    let whereString = ``
    const idArray = []
    
    const validSortBys = [
        'created_at',
        'title',
        'topic',
        'author',
        'votes'
    ]

    const validOrder = [
        'asc',
        'desc'
    ]

    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Bad Sort Request'})
    }

    if(!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Bad Order Request'})
    }

    if(topic != undefined) {
        whereString = `WHERE topic = $1`
        idArray.push(topic)
    }

    return db.query(`
    SELECT author, title, topic, created_at, votes, article_id FROM articles
    ${whereString}
    ORDER BY ${sort_by} ${order};
    `, idArray).then(({ rows }) => {
        return rows
    })
}

exports.fetchArticleByID = (id) => {
    return db.query(`
    SELECT author, title, topic, created_at, votes, article_id FROM articles
    WHERE article_id = $1;
    `, [id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.updateArticleByID = (id, inc_votes) => {
    let symbol = `+`

    if(inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: `Input object invalid`})
    }
    if(typeof(inc_votes) !== 'number') {
        return Promise.reject({ status: 400, msg: `inc_votes value should be number`})
    }
    if(inc_votes < 0) {
        inc_votes *= -1
        symbol = `-`
    }


    return db.query(`
    UPDATE articles
    SET votes = votes ${symbol} $2
    WHERE article_id = $1
    RETURNING author, title, topic, created_at, votes, article_id;
    `, [id, inc_votes]).then(({ rows }) => {
        return rows[0]
    })
}

exports.addComment = (id, body) => {
    console.log(id, body)
    return db.query(`
    INSERT INTO comments
    
    `)
}