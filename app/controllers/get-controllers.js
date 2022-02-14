const { fetchTopics, fetchUsers, fetchArticles, fetchArticleByID } = require('../models/get-models')

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
    fetchArticles().then(articles => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleByID = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleByID(id).then(article => {
        console.log(article)
    })
    .catch(next)
}