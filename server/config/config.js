
//Puerto del servidor
process.env.PORT = process.env.PORT || 3000

//Definición del entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Vencimiento del token
//(60 segundos * 60 minutos * 24hs * 30 dias)
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30

//Secret para el token
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'development-secret'

//API key de OpenWeather
process.env.WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'e3de8159b125ee1ec0e73a9be7bb22b2'

//Base de datos
let urlDB
if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/pronosticador'
else
    urlDB = process.env.MONGO_URI

process.env.DB_URL = urlDB