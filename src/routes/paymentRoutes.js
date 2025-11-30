const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalAuthenticate } = require('../middleware/auth');

router.post('/create_preference', optionalAuthenticate, paymentController.createPreference);

module.exports = router;
