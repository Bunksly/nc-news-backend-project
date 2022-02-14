exports.errorHandler = (err, req, res, next) => {
    res.status(err.status).send( err.msg )
}

exports.pathNotFoundErr = (req, res) => {
    res.status(404).send('Path not found')
}