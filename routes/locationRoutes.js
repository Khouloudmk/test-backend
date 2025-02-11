const express = require('express')
const router = express.Router()
const { getLocationByAddress } = require('../controllers/locationController')

router.post('/get-location', getLocationByAddress)

module.exports = router