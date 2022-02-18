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
        'votes',
        'comment_count'
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
    SELECT articles.author, title, topic, articles.created_at, articles.votes, articles.article_id, CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM comments  
    RIGHT JOIN articles 
    ON articles.article_id = comments.article_id 
    ${whereString}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};   
    `, idArray).then(({ rows }) => {
        return rows
    })
}

exports.fetchArticleByID = (id) => {
    return db.query(`
    SELECT articles.author, title, articles.body, topic, articles.created_at, articles.votes, articles.article_id, CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM comments  
    RIGHT JOIN articles 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
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

exports.fetchCommentsByArticleID = (id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1;
    `, [id]).then(({ rows }) => {
        return rows
    })
}

exports.fetchUserByID = (username) => {
    return db.query(`
    SELECT username, name, avatar_url FROM users
    WHERE username = $1;
    `, [username]).then(({ rows }) => {
        return rows[0]
    })
}

exports.addComment = (id, comment) => {
    return db.query(`
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [comment.username, comment.body, id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.fetchCommentByID = (id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE comment_id = $1
    `, [id]).then(({ rows }) => {
        return rows[0]
    })
}

exports.removeCommentByID = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1;
    `, [id]).then(() => {
        return 'done'
    })
}

exports.updateCommentByID =(id, inc_votes) => {
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
    UPDATE comments
    SET votes = votes ${symbol} $2
    WHERE comment_id = $1
    RETURNING *;
    `, [id, inc_votes]).then(({ rows }) => {
        return rows[0]
    })
}

exports.addTopic = (topic) => {
    return db.query(`
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;
    `, [topic.slug, topic.description]).then(({ rows }) => {
        return rows[0]
    })
}

exports.addArticle = (article) => {
    return db.query(`
    INSERT INTO articles (author, title, body, topic)
    VALUES ($1, $2, $3, $4)
    RETURNING article_id;
    `, [article.author, article.title, article.body, article.topic]).then(({ rows }) => {
        return rows[0].article_id
    }).then((id) => {
        return db.query(`
        SELECT articles.author, title, articles.body, topic, articles.created_at, articles.votes, articles.article_id, CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM comments  
        RIGHT JOIN articles 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `, [id]).then(({ rows }) => {
        return rows[0]
        })
    })
}

exports.fetchTopicBySlug = (topic) => {
    return db.query(`
    SELECT * FROM topics
    WHERE slug = $1;
    `, [topic]).then(({ rows }) => {
        return rows[0]
    })
}