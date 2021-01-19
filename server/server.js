require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
 
app.get('/', function (req, res) {
  res.json('Hola mundo')
})

app.post('/usuario', function (req, res) {
    let body = req.body
    res.json({
        body
    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id

    res.json({
        id
    })
})



mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('Base de datos conectada'))
    .catch(error => console.log('Error al conectar con la BD: ', error))
    



app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', process.env.PORT)
})