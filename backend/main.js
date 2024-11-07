const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/dbwarungmotor'; 

const app = express();

// Connect Database
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Koneksi database berhasil');
  })
  .catch((error) => {
    console.error('Koneksi database gagal:', error);
  });

// Init Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);

// Add more routes /api/products, /api/negotiations, etc.

// Set up the server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
