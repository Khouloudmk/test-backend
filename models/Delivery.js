const mongoose = require('mongoose')
const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    ref: 'Order',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  costumerName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending'/*en attente*/, 'Shipped'/*transporté*/, 'Delivered'/*livré*/, 'Canceled'/* annuler*/ ],
    default: 'Pending',
  },
  
})

const Delivery = mongoose.model('Delivery', deliverySchema)
module.exports = Delivery
