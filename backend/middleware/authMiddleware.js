const jwt = require('jsonwebtoken');

// Middleware zum Überprüfen des Tokens
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Kein Token übergeben' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'dein-geheimschlüssel'); // denselben geheimen Schlüssel wie beim Login verwenden
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Ungültiger Token' });
    }
};

// Middleware für Admin-Zugriff
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Nur Admins dürfen diese Aktion durchführen' });
    }
    next();
};
