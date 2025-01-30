const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId},
      quantity: { type: Number, required: true },
    },
  ],
  price: {type: Number, required:true},
  status: { type: String, required: false, default: 'Pending',
  enum:['pending','confirmed','delivered']},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
