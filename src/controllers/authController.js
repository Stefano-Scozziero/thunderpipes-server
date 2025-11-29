const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Login attempt for user: ${username}`);
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        console.log("Login successful, setting cookie");
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // True en producción (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' para cross-domain en prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.json({ message: "Login exitoso", user: { username: user.username } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    res.json({ message: "Logout exitoso" });
};

exports.checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("CheckAuth: No token found");
        return res.status(401).json({ authenticated: false });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("CheckAuth: Token verified for user", decoded.username);
        res.json({ authenticated: true, user: decoded });
    } catch (error) {
        console.log("CheckAuth: Invalid token");
        res.status(401).json({ authenticated: false });
    }
};