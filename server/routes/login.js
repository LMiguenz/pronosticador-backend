const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/usuario')
  
const app = express()


app.post('/login', function (req, res) {

    let body = req.body

    User.findOne({email: body.email}, (err, userDb) => {
        if(err){
            return res.status(500).json({
                err
            })
        }

        if( !userDb ){
            return res.status(400).json({
                err: {
                    message: "Credenciales incorrectas"
                }
            })
        }

        const isPasswordOk = bcrypt.compareSync(body.password, userDb.password)
        if( !isPasswordOk ){
            return res.status(400).json({
                err: {
                    message: "Credenciales incorrectas"
                }
            })
        }

        const token = jwt.sign({
                user: userDb
            }, 
            process.env.TOKEN_SECRET, 
            {expiresIn: process.env.TOKEN_EXPIRATION}
        )

        res.json({
            user: userDb,
            token
        })
    })
})

module.exports = app