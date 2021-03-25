const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user')

const {verifyToken, verifyAdminRole} = require('../middleware/auth')

const router = express()


router.post('/usuario', function (req, res) {
    bcrypt.hash(req.body.password, 10)
        .catch( err => console.log("Password encryption error: ", err))
        .then( hash => saveUserToDB(req.body, hash, res))
})

function saveUserToDB(requestBody, encryptedPassword, res){
    let user = new User({
        email: requestBody.email,
        password: encryptedPassword,
        name: requestBody.name,
        role: requestBody.role
    })

    user.save( (err, dbUser) => {
        if(err){
            return res.status(400).json({
                err
            })
        }

        res.status(200).json({
            user: dbUser
        })
    })
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

    User.findByIdAndUpdate(id, body, 
        {
            new: true, 
            runValidators: true, 
            context: 'query'
        }, 
        (err, dbUser) => {
            if(err){
                return res.status(400).json({
                    err
                })
            }

        res.status(200).json({
            user: dbUser
        })
    })
})

  
router.delete('/usuario/:id', [verifyToken, verifyAdminRole], function (req, res) {
    let id = req.params.id

    User.findByIdAndUpdate(id, { isActive: false }, {new: true, runValidators: true}, (err, dbUser) => {
        if(err){
            return res.status(400).json({
                err
            })
        }

        res.status(200).json({
            user: dbUser
        })
    })
})


module.exports = router;