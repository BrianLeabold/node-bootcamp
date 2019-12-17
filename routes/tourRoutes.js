const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// POST /tour/1234/reviews
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-rated')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.getTourStats
  );

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.monthlyPlan
  );

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;
