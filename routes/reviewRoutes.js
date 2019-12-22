const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReviews);
router.route('/:id').get(reviewController.getReview);

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('user', 'customer', 'admin'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'customer', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'customer', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
