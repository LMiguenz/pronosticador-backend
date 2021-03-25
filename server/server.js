require('./config/config')
const express = require('express')
const router = express()
// const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }))
// parse application/json
router.use(express.json())
//Configuración de rutas
router.use( require('./routes/index') )

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => console.log('Base de datos conectada'))
    .catch(error => console.log('Error al conectar con la BD: ', error))
    

router.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', process.env.PORT)
})