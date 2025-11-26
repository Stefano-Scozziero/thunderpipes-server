// server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true }, // URL de la imagen
    desc: { type: String, required: true },
    category: { type: String, default: 'escape' }, // Para filtrar futuro
    stock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);