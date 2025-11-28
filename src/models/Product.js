const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true }, // Stock Keeping Unit
    price: { type: Number, required: true },
    images: [{ type: String }], // Array of image URLs
    img: { type: String }, // Backwards compatibility (main image)
    desc: { type: String, required: true },
    category: { type: String, default: 'escape' },
    stock: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update 'updatedAt'
ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    // Ensure 'img' is populated if 'images' has items
    if (this.images && this.images.length > 0 && !this.img) {
        this.img = this.images[0];
    }
    if (typeof next === 'function') {
        next();
    }
});

module.exports = mongoose.model('Product', ProductSchema);
