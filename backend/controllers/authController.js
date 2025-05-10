const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Deine MySQL-Datenbankverbindung


exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt werden!' });
    }

    // Überprüfe, ob der Benutzer schon existiert
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Datenbankfehler', error: err });

        if (result.length > 0) {
            return res.status(400).json({ message: 'Benutzer existiert bereits!' });
        }

        // Passwort verschlüsseln
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Neues Benutzerkonto in der Datenbank erstellen
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, 'customer'], (err, result) => {
            if (err) return res.status(500).json({ message: 'Fehler bei der Registrierung', error: err });
            
            // Erfolgreiche Antwort
            res.status(201).json({ message: 'Registrierung erfolgreich!' });
        });
    });
};

// Login eines Benutzers
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich!' });
    }

    // Benutzer aus der Datenbank abfragen
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Datenbankfehler', error: err });

        if (result.length === 0) {
            return res.status(400).json({ message: 'Benutzer nicht gefunden!' });
        }

        // Passwort vergleichen
        const user = result[0];  // Den ersten Benutzer aus der Datenbank auswählen

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Falsches Passwort!' });
        }

        // JWT-Token generieren
        const token = jwt.sign({ userId: user.id, role: user.role }, 'dein-geheimschlüssel', { expiresIn: '1h' });

        // Erfolgreiche Login-Antwort
        res.status(200).json({
            message: 'Login erfolgreich!',
            token: token,  // Token zurückgeben, um es im Frontend zu speichern
        });
    });
};
