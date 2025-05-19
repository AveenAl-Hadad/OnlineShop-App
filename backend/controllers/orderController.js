const db = require('../config/db');

exports.getOrdersByUser = (req, res) => {
    const userId = req.user.id; // <- Hier korrigiert

    const sql = `SELECT * FROM orders WHERE user_id = ?`;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Fehler beim Abrufen:", err);
            return res.status(500).json({ message: "Fehler beim Abrufen" });
        }
        res.json(results);
    });
};

exports.createOrder = async (req, res) => {
    const { delivery_address, name, phone, email, payment_method, cart } = req.body;
    const userId = req.user.id;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Warenkorb ist leer' });
    }

    const sql = `
        INSERT INTO orders (user_id, order_date, status, delivery_address, name, phone, email, payment_method)
        VALUES (?, NOW(), 'offen', ?, ?, ?, ?, ?)
    `;

    db.query(sql, [userId, delivery_address, name, phone, email, payment_method], (err, result) => {
        if (err) {
            console.error("❌ Fehler beim Einfügen der Bestellung:", err);
            return res.status(500).json({ message: 'Fehler beim Speichern der Bestellung' });
        }

        const orderId = result.insertId;

        const values = cart.map(item => [orderId, item.id, item.quantity]);
        const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';

        db.query(itemSql, [values], (err2) => {
            if (err2) {
                console.error("❌ Fehler bei order_items:", err2);
                return res.status(500).json({ message: 'Fehler beim Speichern der Artikel' });
            }

            res.status(201).json({ message: '✅ Bestellung erfolgreich erstellt', orderId });
        });
    });
};

exports.getAllOrders = (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error('Fehler beim Abrufen der Bestellungen:', err);
            return res.status(500).json({ message: 'Serverfehler' });
        }
        res.json(results);
    });
};
