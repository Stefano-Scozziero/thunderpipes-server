const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado. Requiere rol de administrador." });
    }
};

router.get('/', authMiddleware, isAdmin, userController.getAllUsers);
router.delete('/:id', authMiddleware, isAdmin, userController.deleteUser);

module.exports = router;
