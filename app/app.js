const express = require('express')
const { getTopics, getUsers } = require('./controllers/get-controllers')
const { pathNotFoundErr, errorHandler } = require('./controllers/error-controllers')

const app = express()

app.get('/api/topics', getTopics)
app.get('/api/users', getUsers)

app.all('/*', pathNotFoundErr)

app.use(errorHandler)

module.exports = app