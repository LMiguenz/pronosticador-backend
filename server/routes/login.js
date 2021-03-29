const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
  
const router = express()


router.post('/login', function (req, res) {
    authUser(req.body.email, req.body.password)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(error.status).send(error.message) )
})


async function authUser(email, password){
    try{
        const dbUser = await User.findOne({email})
        if( !dbUser ){
            throw getWrongCredentialsError()
        }else{
            const isPasswordOk = await bcrypt.compare(password, dbUser.password)
            if( !isPasswordOk )
                throw getWrongCredentialsError()
            else{
                const token = jwt.sign(
                    {user: dbUser}, 
                    process.env.TOKEN_SECRET, 
                    {expiresIn: process.env.TOKEN_EXPIRATION}
                )
                return {user: dbUser, token}
            }
        }
    }catch(error){
        let returnError = new Error(error.message)
        returnError.status = 500
        throw returnError
    }
}

function getWrongCredentialsError(){
    let wrongCredentialsError = new Error("Credenciales incorrectas")
    wrongCredentialsError.status = 400
    return wrongCredentialsError
}


module.exports = router