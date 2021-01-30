const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/usuario')
  
const app = express()


app.post('/login', function (req, res) {

    res.status(200).json({
        ok: true
    })
})

module.exports = app