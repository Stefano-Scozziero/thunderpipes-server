const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access productId from parent route
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', reviewController.getReviews);
router.post('/', verifyToken, reviewController.createReview);

module.exports = router;
