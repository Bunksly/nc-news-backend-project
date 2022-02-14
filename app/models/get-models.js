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

exports.fetchArticles = () => {
    return db.query(`
    SELECT author, title, topic, created_at, votes FROM articles
    ORDER BY created_at DESC;
    `).then(({ rows }) => {
        return rows
    })
}

exports.fetchArticleByID = (id) => {
    return db.query(`
    SELECT author, title, topic, created_at, votes
    `)
}