const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.use(bodyParser.json());  // Damit JSON-Daten verarbeitet werden können


// Test-Route
app.get('/', (req, res) => {
    res.send('✅ Willkommen auf dem Backend-Server!');
  });
  
// Routen verwenden
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Server starten
app.listen(5000, () => {
    console.log('Server läuft auf http://localhost:5000');
});
