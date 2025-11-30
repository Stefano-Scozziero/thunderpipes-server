const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            console.log("Admin user exists.");
            // Optional: Reset password to ensure it matches user request
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('admin123', salt);
            admin.role = 'admin'; // Ensure role is admin
            await admin.save();
            console.log("Admin password reset to 'admin123'");
        } else {
            console.log("Admin user not found. Creating...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const newAdmin = new User({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                address: {
                    street: 'Admin St',
                    city: 'Admin City',
                    zip: '00000',
                    phone: '000-0000'
                }
            });
            await newAdmin.save();
            console.log("Admin user created.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkAdmin();
