const { fetchTopics } = require('../models/get-models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then(topics => {
        res.status(200).send({ topics })
    })
    .catch(next)
}