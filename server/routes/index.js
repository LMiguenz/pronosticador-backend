const express = require('express')
const app = express()

app.use( require('./usuario') )
app.use( require('./login') )
app.use( require('./weather') )

module.exports = app