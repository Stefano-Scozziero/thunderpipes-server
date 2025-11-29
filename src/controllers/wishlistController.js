const wishlistService = require('../services/wishlistService');
const logger = require('../utils/logger');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user.id);
        res.json(wishlist);
    } catch (error) {
        logger.error('Error fetching wishlist', { error: error.message });
        res.status(500).json({ error: "Error fetching wishlist" });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.addToWishlist(req.user.id, req.params.productId);
        res.json(wishlist);
    } catch (error) {
        logger.error('Error adding to wishlist', { error: error.message });
        res.status(500).json({ error: "Error adding to wishlist" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
        res.json(wishlist);
    } catch (error) {
        logger.error('Error removing from wishlist', { error: error.message });
        res.status(500).json({ error: "Error removing from wishlist" });
    }
};
