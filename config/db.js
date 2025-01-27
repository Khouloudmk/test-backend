const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tobeeye2000:12345678GRP@cluster0.zuxgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
