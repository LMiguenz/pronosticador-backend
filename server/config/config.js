//Puerto del servidor
process.env.PORT = process.env.PORT || 3000

//Definición del entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Base de datos
let urlDB
if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/pronosticador'
else
    urlDB = process.env.MONGO_URI

process.env.DB_URL = urlDB