const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/dataBase');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes')


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use('/api', deliveryRoutes)
app.use('/api', userRoutes);
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
