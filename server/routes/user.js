const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const User = require('../models/user')
const {verifyToken, verifyAdminRole} = require('../middleware/auth')

const router = express()


router.post('/usuario', function (req, res) {
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role
    })

    createUser(user)
        .then( dbUser => res.status(200).json({dbUser}) )
        .catch( error => res.status(error.status).send(error.message))
})

async function createUser(user){
    try{
        const encryptedPassword = await getEncryptedPassword(user.password)
        return await saveUserToDB(user, encryptedPassword)
    }catch(error){
        throw error
    }
}

async function getEncryptedPassword(password){
    try{
        return await bcrypt.hash(password, 10)
    }catch(encryptionError){
        encryptionError.status = 500
        throw encryptionError
    }
}

async function saveUserToDB(user, encryptedPassword){
    let userWithEncryptedPassword = user
    userWithEncryptedPassword.password = encryptedPassword

    try{
        return await userWithEncryptedPassword.save()
    }catch(error){
        let returnError = new Error(error.message)
        returnError.status = 500
        throw returnError
    }
}

router.get('/usuarios', [verifyToken, verifyAdminRole], function (req, res) {
    const offset = Number(req.query.offset || 0)
    const limit = Number(req.query.limit || 0)

    let filterPredicate = { isActive: true }

    User.find(filterPredicate)
        .skip(offset)
        .limit(limit)
        .exec()
        .catch( err => { res.status(400).json({err}) })
        .then( users => {
            User.countDocuments(filterPredicate)
                .then( count => {
                    res.json({
                        count,
                        users
                    })
                })
        })
})

router.put('/usuario', verifyToken, function (req, res) {
    let id = req.user.uid
    let body = _.pick(req.body, ['name', 'email', 'role', 'isActive'])

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then( dbUser => res.status(200).json({ user: dbUser }))
        .catch( error => res.status(400).json({ error }))
})

  
router.delete('/usuario/:id', [verifyToken, verifyAdminRole], function (req, res) {
    let id = req.params.id

    User.findByIdAndUpdate(id, { isActive: false }, {new: true, runValidators: true})
        .then( dbUser => res.status(200).json({ user: dbUser }))
        .catch( error => res.status(400).json({ error }))
})


module.exports = router;