const express = require('express')
const axios = require('axios').default
const {verifyToken, _} = require('../middleware/auth')

const app = express()
const openWeatherBaseUrl = "https://api.openweathermap.org/data/2.5"

app.get('/clima', verifyToken, function (req, res) {
    getCurrentWeatherFor(req.query.query)
        .catch( error => { 
            res.status(error.status).send(error.message) 
        })
        .then( result => { res.status(200).send(result) })
        
})

async function getCurrentWeatherFor(cityQuery){
    try{
        const result = await axios.get(`${openWeatherBaseUrl}/weather?q=${cityQuery}&appid=${process.env.WEATHER_API_KEY}`)
        console.log(result)
        return await result.data
    }catch(error){
        console.log(error)
        if(error.response.data.cod == "404"){
            let error = new Error("No se encontró la ciudad")
            error.status = 404
            throw error
        }else{
            if(error.response.data != undefined){                
                let returnError = new Error(error.response.data.message)
                returnError.status = error.response.data.cod
                throw returnError
            }else{
                let returnError = new Error("Ha ocurrido un error desconocido")
                returnError.status = 500
            }
        }
            
    }
}
    

module.exports = app;