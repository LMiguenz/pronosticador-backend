const express = require('express')
const axios = require('axios').default
const {verifyToken, _} = require('../middleware/auth')

const User = require('../models/usuario')
const Favourite = require('../models/favourite')

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
    

app.put('/favoritos', verifyToken, (req, res) => {
    addToFavourites(req, res)
})

async function addToFavourites(req, res){
    const fav = new Favourite()
    fav.queryString = req.query.q
    const savedFav = await fav.save()
    if(savedFav === fav){
        const userFromDB = await User.findById(req.user.uid)
        if(userFromDB){
            userFromDB.favourites.push(fav)
            userFromDB.save()
            res.status(200).send("Favorito agregado!")
        }
    }else{
        res.status(500).send("Error: " + savedFav.error)
    }
}

module.exports = app;