require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 5000;
const orderRoutes = require('./routes/orderRoutes');


// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.use(bodyParser.json());  // Damit JSON-Daten verarbeitet werden können

// Statische Bilder ausliefern
app.use('/static/images', express.static(path.join(__dirname, 'static/images')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', orderRoutes);// z. B. http://localhost:5000/api/orders/user

// Test
app.get('/', (req, res) => res.send('✅ Backend läuft!'));

// Start
app.listen(PORT, () => console.log(`🚀 Server auf http://localhost:${PORT}`));


