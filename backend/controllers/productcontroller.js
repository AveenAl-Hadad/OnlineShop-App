const db = require('../config/db');

// Alle Produkte abrufen
exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Abrufen der Produkte', error: err });
        }
        res.json(results);
    });
};


// Ein Produkt hinzufügen
exports.addProduct = (req, res) => {
    const { name, description, price, discount, is_offer, image_url } = req.body;

    // Überprüfen, ob alle notwendigen Felder gesendet wurden
    if (!name || !description || !price || !image_url) {
        return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt werden!' });
    }

    // SQL-Query zum Hinzufügen eines Produkts
    const query = 'INSERT INTO products (name, description, price, discount, is_offer, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, price, discount, is_offer, image_url], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Fehler beim Hinzufügen des Produkts!', error: err });
        }

        // Erfolgreiche Antwort
        res.status(201).json({ message: 'Produkt erfolgreich hinzugefügt!', productId: result.insertId });
    });
};

// Ein Produkt bearbeiten
exports.updateProduct = (req, res) => {
    const { id, name, description, price, discount, is_offer, image_url } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt werden!' });
    }

    const query = 'UPDATE products SET name = ?, description = ?, price = ?, discount = ?, is_offer = ?, image_url = ? WHERE id = ?';
    db.query(query, [name, description, price, discount, is_offer, image_url, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Bearbeiten des Produkts', error: err });
        }
        res.json({ message: 'Produkt erfolgreich bearbeitet!' });
    });
};

// Ein Produkt löschen
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Löschen des Produkts', error: err });
        }
        res.json({ message: 'Produkt erfolgreich gelöscht!' });
    });
};
// In deinem Produkt-Controller (productController.js)
exports.getProducts = (req, res) => {
    const query = 'SELECT * FROM products';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Abrufen der Produkte', error: err });
        }
        
        // Erfolgreiche Antwort, gebe die Produkte zurück
        res.status(200).json(results);
    });
};
