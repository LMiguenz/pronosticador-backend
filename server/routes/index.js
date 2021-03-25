const express = require('express')
const router = express()

router.use( require('./user') )
router.use( require('./login') )
router.use( require('./weather') )

module.exports = router