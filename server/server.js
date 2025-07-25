const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
// TODO: Add other routes here
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/sales', require('./routes/saleRoutes'));

app.get('/', (req, res) => {
  res.send('Apothecary POS API Running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`));