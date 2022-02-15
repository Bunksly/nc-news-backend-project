exports.errorHandler = (err, req, res, next) => {
    const { msg } = err
    res.status(err.status).send( { msg } )
}

exports.pathNotFoundErr = (req, res) => {
    res.status(404).send('Path not found')
}