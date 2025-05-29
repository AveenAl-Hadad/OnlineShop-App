const db = require('../config/db');
exports.getAllOrders = (req, res) => {
	db.query('SELECT * FROM orders', (err, results) => {
	    if (err) {
	        console.error('Fehler beim Abrufen der Bestellungen:', err);
	        return res.status(500).json({ message: 'Serverfehler' });
		}
	    res.json(results);
	});
}
;
exports.getOrdersByUser = (req, res) => {
	const userId = req.user.id;	
	const ordersSql = `SELECT * FROM orders WHERE user_id = ?`;
	db.query(ordersSql, [userId], (err, orders) => {
	    if (err) {
	        console.error("Fehler beim Abrufen der Bestellungen:", err);
	        return res.status(500).json({ message: "Fehler beim Abrufen" });
		} // If ende
	    if (orders.length === 0) {
	        return res.json([]);
		} //If Ende
	    // Hole alle order_ids
        const orderIds = orders.map(order => order.id);
	    // Frage alle Artikel für diese Bestellungen ab, inkl. Produktname
	    const itemsSql = `
	        SELECT 
	            oi.order_id,
	            oi.quantity,
	            p.name AS product_name
			FROM order_items oi
	        JOIN products p ON oi.product_id = p.id
	        WHERE oi.order_id IN (?)
	    `;
	    db.query(itemsSql, [orderIds], (err, items) => {
	        if (err) {
	            console.error("Fehler beim Abrufen der Artikel:", err);
	            return res.status(500).json({ message: "Fehler beim Abrufen der Artikel" });
			}
	        // Ordne Artikel den Bestellungen zu
	        const ordersWithItems = orders.map(order => {
	            const orderItems = items.filter(item => item.order_id === order.id);
	            return {
	                ...order,
	                items: orderItems
	            };
        	}); // ende orderWithItem
        	res.json(ordersWithItems);
	    });// db query
	}); // end db query
}; //getOrdersByUser

exports.createOrder = (req, res) => {
	const { delivery_address, name, phone, email, payment_method, cart } = req.body;
	const userId = req.user.id;
	if (!cart || cart.length === 0) {
	    return res.status(400).json({ message: 'Warenkorb ist leer' });
	}
	// Beginne eine Transaktion
	db.beginTransaction(err => {
	    if (err) {
	        console.error("Fehler beim Starten der Transaktion:", err);
	        return res.status(500).json({ message: 'Serverfehler' });
		}
	        // Überprüfe den Lagerbestand für jedes Produkt
	        const checkStockPromises = cart.map(item => {
	            return new Promise((resolve, reject) => {
	                const query = 'SELECT stock FROM products WHERE id = ?';
	                db.query(query, [item.id], (err, results) => {
	                    if (err) return reject(err);
	                    if (results.length === 0) return reject(new Error(`Produkt mit ID ${item.id} nicht gefunden.`));
	                    const stock = results[0].stock;
	                    if (stock < item.quantity) return reject(new Error(`Nicht genügend Lagerbestand für Produkt ID ${item.id}.`));
	                    resolve();
	                });
	            });
	        });
	
	        Promise.all(checkStockPromises)
	            .then(() => {
	                // Füge die Bestellung ein
	                const orderSql = `
	                    INSERT INTO orders (user_id, order_date, status, delivery_address, name, phone, email, payment_method)
	                    VALUES (?, NOW(), 'offen', ?, ?, ?, ?, ?)
	                `;
	                db.query(orderSql, [userId, delivery_address, name, phone, email, payment_method], (err, result) => {
	                    if (err) {
	                        return db.rollback(() => {
	                            console.error("Fehler beim Einfügen der Bestellung:", err);
	                            res.status(500).json({ message: 'Fehler beim Speichern der Bestellung' });
	                        });
	                    }
	                    const orderId = result.insertId;
	                    // Füge die Bestellartikel ein
	                    const itemValues = cart.map(item => [orderId, item.id, item.quantity]);
	                    const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
	
	                    db.query(itemSql, [itemValues], (err) => {
	                        if (err) {
	                            return db.rollback(() => {
	                                console.error("Fehler beim Einfügen der Bestellartikel:", err);
	                                res.status(500).json({ message: 'Fehler beim Speichern der Artikel' });
	                            });
	                        }
	                        // Aktualisiere den Lagerbestand für jedes Produkt
	                        const updateStockPromises = cart.map(item => {
	                            return new Promise((resolve, reject) => {
	                                const updateQuery = 'UPDATE products SET stock = stock - ? WHERE id = ?';
	                                db.query(updateQuery, [item.quantity, item.id], (err, result) => {
	                                    if (err) return reject(err);
	                                    resolve();
	                                });
	                            });
	                        });
	
	                        Promise.all(updateStockPromises)
	                            .then(() => {
	                                // Bestätige die Transaktion
	                                db.commit(err => {
	                                    if (err) {
	                                        return db.rollback(() => {
	                                            console.error("Fehler beim Bestätigen der Transaktion:", err);
	                                            res.status(500).json({ message: 'Fehler beim Abschließen der Bestellung' });
	                                        });
	                                    }
	                                    res.status(201).json({ message: 'Bestellung erfolgreich erstellt', orderId });
	                                });
	                            })
	                            .catch(err => {
	                                db.rollback(() => {
	                                    console.error("Fehler beim Aktualisieren des Lagerbestands:", err);
	                                    res.status(500).json({ message: 'Fehler beim Aktualisieren des Lagerbestands' });
	                                });
	                            });
	                    });
	                });
	            })
	            .catch(err => {
	                db.rollback(() => {
	                    console.error("Fehler bei der Lagerbestandsprüfung:", err);
	                    res.status(400).json({ message: err.message });
	                });
	            });
	    });
	};
	
