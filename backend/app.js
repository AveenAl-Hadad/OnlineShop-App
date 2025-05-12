const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 5000;

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


// Test
app.get('/', (req, res) => res.send('✅ Backend läuft!'));

// Start
app.listen(PORT, () => console.log(`🚀 Server auf http://localhost:${PORT}`));


