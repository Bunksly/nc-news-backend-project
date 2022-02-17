const { fetchTopics, fetchUsers, fetchArticles, fetchArticleByID, updateArticleByID, fetchCommentsByArticleID, addComment, fetchUserByID, fetchCommentByID, removeCommentByID } = require('../models/get-models')
const endpoints = require('../../endpoints.json')

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

exports.getCommentsByArticleID = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleByID(id).then(article => {
        if(article == undefined) {
            return Promise.reject({ status: 404, msg: `Article ${id} not found`})
            .catch((err) => {
                next(err)
            })
        }
    })
    fetchCommentsByArticleID(id).then(comments => {
        if(comments.length == 0) {
            return Promise.reject({ status: 404, msg: `No comments found`})
        }
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.getUserByID = (req, res, next) => {
    const username = req.params.username
    fetchUserByID(username).then(user => {
        if(user == undefined) {
            return Promise.reject({ status: 404, msg: `User ${username} not found`})
        }
        res.status(200).send({ user })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const id = req.params.article_id
    const comment = req.body
    if(!comment.hasOwnProperty('username') || !comment.hasOwnProperty('body')) {
        return Promise.reject({ status: 400, msg: 'Input invalid, requires username and body'})
        .catch((err) => {
            next(err)
        })
    }
    fetchUserByID(req.body.username)
    .then((user) => {
        if(user == undefined) {
            return Promise.reject({ status: 404, msg: `User ${req.body.username} not found`})
        }
    })
    .then(() => {
        return fetchArticleByID(id)
    })   
    .then(article => {
        if(article == undefined) {
            return Promise.reject({ status: 404, msg: `Article ${id} not found`})
        }
    })
    .then(() => {
        addComment(id, comment).then(comment => {
        res.status(201).send({ comment })
        })
    })
    .catch(next)
}

exports.deleteCommentByID = (req, res, next) => {
    const id = req.params.comment_id
    fetchCommentByID(id)
    .then(comment => {
        console.log(comment)
        if(!comment) {
            return Promise.reject({ status: 404, msg: `Comment ${id} not found`})
            .catch(err => {
                next(err)
            })
        }  
    })
    removeCommentByID(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({pathways: endpoints})
}