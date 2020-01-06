const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckouSession);

// router.use(authController.restrictTo('admin', 'lead-guide'));

module.exports = router;
