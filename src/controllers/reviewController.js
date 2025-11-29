const reviewService = require('../services/reviewService');
const logger = require('../utils/logger');

exports.getReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByProduct(req.params.productId);
        res.json(reviews);
    } catch (error) {
        logger.error('Error fetching reviews', { error: error.message });
        res.status(500).json({ error: "Error fetching reviews" });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await reviewService.createReview(req.user.id, req.params.productId, rating, comment);
        res.status(201).json(review);
    } catch (error) {
        logger.error('Error creating review', { error: error.message });
        res.status(500).json({ error: "Error creating review" });
    }
};
