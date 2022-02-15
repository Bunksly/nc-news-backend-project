const { fetchTopics, fetchUsers, fetchArticles, fetchArticleByID, updateArticleByID, addComment } = require('../models/get-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then(topics => {
        res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then(users => {
        res.status(200).send({ users })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const sort_by = req.query.sort_by
    const order = req.query.order
    const topic = req.query.topic
    fetchArticles(sort_by, order, topic).then(articles => {
        if(articles.length == 0) {
            return Promise.reject({ status: 404, msg: `Topic ${topic} not found`})
        }
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleByID = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleByID(id).then(article => {
        if(article == undefined) {
            return Promise.reject({ status: 404, msg: `Article ${id} not found`})
        }
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchArticleByID = (req, res, next) => {
    const id = req.params.article_id
    const inc_votes = req.body.inc_votes
    updateArticleByID(id, inc_votes).then(article => {
        if(article == undefined) {
            return Promise.reject({ status: 404, msg: `Article ${id} not found`})
        }
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const id = req.params.article_id
    const body = req.body
    addComment(id, body).then(comment => {
        console.log(comment)
    })
    .catch(next)
}