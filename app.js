const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/dataBase');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bodyParser=require("body-parser");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes)
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    res.send('MongoDB connection successful!!');
  } catch (error) {
    res.status(500).send('Failed to connect to MongoDB' + error.message);
  }
});
app.listen(PORT, () => {
  console.log(`server running : http://localhost:${PORT}`);
});
