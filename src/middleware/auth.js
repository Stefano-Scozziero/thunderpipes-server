const { verifyToken } = require('../services/authService');

exports.authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No autenticado" });
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

exports.optionalAuthenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();
    try {
        const { verifyToken } = require('../services/authService');
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        next();
    }
};
