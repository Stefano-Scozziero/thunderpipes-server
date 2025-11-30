const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        console.log("Fetching all users...");
        const users = await User.find({}, '-password'); // Exclude password
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};
