const Review = require('../models/Review');

exports.getReviewsByProduct = async (productId) => {
    return await Review.find({ product: productId }).populate('user', 'username');
};

exports.createReview = async (userId, productId, rating, comment) => {
    const review = new Review({ user: userId, product: productId, rating, comment });
    return await review.save();
};
