const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

    const token = req.get('Authorization')

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err){
            return res.status(401).json({
                err
            })
        }

        req.user = payload.user

        next()
    })
}

const verifyAdminRole = (req, res, next) => {

    const user = req.user

    if(user.role != 'ADMIN'){
        return res.status(401).json({
            err: {
                message: "Servicio restringido a administradores"
            }
        })
    }
        
    next()
}

module.exports = {
    verifyToken,
    verifyAdminRole
}