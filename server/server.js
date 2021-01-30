require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//Configuración de rutas
app.use( require('./routes/index') )

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('Base de datos conectada'))
    .catch(error => console.log('Error al conectar con la BD: ', error))
    

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', process.env.PORT)
})