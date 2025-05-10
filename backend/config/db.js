const mysql = require('mysql2');

// Erstelle eine Verbindung zur MySQL-Datenbank
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Standardbenutzername für MySQL
    password: '',  // Dein MySQL-Passwort (leeres Passwort, wenn du XAMPP verwendest)
    database: 'onlineshop'  // Name der Datenbank
});

// Verbindungsprüfung
db.connect((err) => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank: ', err);
        return;
    }
    console.log('Erfolgreich mit der MySQL-Datenbank verbunden.');
});

module.exports = db;
