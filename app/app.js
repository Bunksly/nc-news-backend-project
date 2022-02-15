const express = require('express')
const { getTopics, getUsers, getArticles, getArticleByID, patchArticleByID, getCommentsByArticleID, postComment, getUserByID } = require('./controllers/get-controllers')
const { pathNotFoundErr, errorHandler, handle500s } = require('./controllers/error-controllers')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/users', getUsers)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles/:article_id/comments', getCommentsByArticleID)
app.get('/api/users/:username', getUserByID)

app.patch('/api/articles/:article_id', patchArticleByID)

app.post('/api/articles/:article_id/comments', postComment)

app.all('/*', pathNotFoundErr)

app.use(errorHandler)
app.use(handle500s)

module.exports = app