const authService = require('../services/authService');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info(`Login attempt for user: ${username}`);

        const { user, token } = await authService.login(username, password);

        logger.info("Login successful, setting cookie");
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ message: "Login exitoso", user: { username: user.username } });
    } catch (error) {
        logger.error("Login error:", { error: error.message });
        res.status(401).json({ error: error.message });
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
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = authService.verifyToken(token);
        res.json({ authenticated: true, user: decoded });
    } catch (error) {
        logger.warn("CheckAuth: Invalid token");
        res.status(401).json({ authenticated: false });
    }
};