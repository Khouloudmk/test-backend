const express = require('express')
const deliveryRoutes = require('./routes/deliveryRoutes')
const connectDB = require('./config/db')
const app = express() 
connectDB()

app.use(express.json()) 
app.use('/api', deliveryRoutes) // utiliser les routes

// démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
