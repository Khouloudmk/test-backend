const express = require('express')
const {createDelivery,getAllDeliveries,updateDelivery,deleteDelivery,getDeliveryById,
getDeliveriesByAddress,getDeliveriesByDate,getDeliveriesByStatus,generateDeliveryPDF} = require('../controllers/deliveryController')
const router = express.Router()

router.post('/creat', createDelivery)
router.get('/get', getAllDeliveries)
router.get('/get/:id', getDeliveryById)
router.put('/update/:id', updateDelivery)
router.delete('/delete/:id', deleteDelivery)
router.get('/findA', getDeliveriesByAddress)
router.get('/findD', getDeliveriesByDate)
router.get('/findS', getDeliveriesByStatus)
router.get('/:id/pdf', generateDeliveryPDF)


module.exports = router
