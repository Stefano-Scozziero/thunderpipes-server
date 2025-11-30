const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // sparse allows null/undefined to be unique (for existing users)
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    address: {
        street: String,
        city: String,
        zip: String,
        phone: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
