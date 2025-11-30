const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log("Admin user not found!");
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        admin.password = hashedPassword;
        await admin.save();

        console.log("Admin password reset to 'admin123'");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetAdmin();
