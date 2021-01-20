const express = require('express')
const app = express()
  
app.post('/usuario', function (req, res) {
    let body = req.body
    res.json({
        body
    })
})

app.get('/usuario', function (req, res) {
    res.json('GET usuario')
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id

    res.json({
        id
    })
})

  
app.delete('/usuario', function (req, res) {
    res.json('DELETE usuario')
})


module.exports = app;