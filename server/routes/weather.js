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
        const result = await axios.get(`${openWeatherBaseUrl}/weather?q=${cityQuery}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=es`)
        console.log(result)
        return await result.data
    }catch(error){
        console.log(error)
        if(error.response.data.cod == "404"){
            let error = new Error("No se encontró la ciudad")
            error.status = 404
            throw error
        }else{
            let returnError
            if(error.response.data != undefined){                
                returnError = new Error(error.response.data.message)
                returnError.status = error.response.data.cod
            }else{
                returnError = new Error("Ha ocurrido un error desconocido")
                returnError.status = 500
            }
            throw returnError
        }
            
    }
}
    

app.post('/favoritos', verifyToken, (req, res) => {
    addToFavourites(req, res)
})

async function addToFavourites(req, res){
    const fav = new Favourite()
    fav.queryString = req.query.q
    fav.userId = req.user.uid

    try{
        await fav.save()
        const userFromDB = await User.findById(req.user.uid)
        if(userFromDB){
            userFromDB.favourites.push(fav)
            userFromDB.save()
            res.status(200).send(`La búsqueda ${fav.queryString} se agregó a tu lista de favoritos`)
        }
    }catch(error){
        res.status(500).send(`Error: ¡la búsqueda ${fav.queryString} ya estaba en tu lista de favoritos!`)
    }
}


app.get('/favoritos', verifyToken, (req, res) => {

    queryAllUserFavourites(req)
        .then(result => { res.status(200).json(result) })
        .catch(error => { res.status(error.status).send(error) })
})

async function queryAllUserFavourites(req){
    try{
        const user = await User.findById(req.user.uid).populate('favourites').exec()
        
        const requestPromises = user.favourites.map(fav => 
            getCurrentWeatherFor(fav.queryString).catch(e => e.message)
        )
        const results = await Promise.all(requestPromises)

        let formattedResult = []
        //Le doy formato a la respuesta
        for(i = 0; i < user.favourites.length; i++){
            formattedResult.push(
                {
                    query: user.favourites[i].queryString,
                    result: results[i]
                }
            )
        }

        return formattedResult
    }catch(error){
        throw new Error(error)
    }
}

module.exports = app;