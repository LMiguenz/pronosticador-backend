const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/usuario')
  
const app = express()


app.post('/usuario', function (req, res) {
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

app.get('/usuario', function (req, res) {
    res.json('GET usuario')
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'role', 'isActive'])

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, dbUser) => {
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

  
app.delete('/usuario', function (req, res) {
    res.json('DELETE usuario')
})


module.exports = app;