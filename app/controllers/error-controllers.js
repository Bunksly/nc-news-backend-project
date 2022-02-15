exports.pathNotFoundErr = (req, res) => {
    res.status(404).send('Path not found')
}

exports.errorHandler = (err, req, res, next) => {
    const { msg } = err
    if(msg) {
        res.status(err.status).send( { msg } ) 
    } else {
        next(err)
    }
}

exports.handle500s = (err, req, res, next) => {
    console.log(err)
    const obj = {
        msg: 'Server error'
    }
    res.status(500).send(obj)
}