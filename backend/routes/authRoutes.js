const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routen für Login und Registrierung
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
