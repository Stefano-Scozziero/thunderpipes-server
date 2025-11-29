const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return wishlist;
};

exports.addToWishlist = async (userId, productId) => {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
    }
    return wishlist.populate('products');
};

exports.removeFromWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        return wishlist.populate('products');
    }
    return null;
};
