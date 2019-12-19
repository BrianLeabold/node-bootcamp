const express = require('express');
const servicesController = require('../controllers/servicesController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(servicesController.getAllServices)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    servicesController.createService
  );

router
  .route('/:id')
  .get(servicesController.getService)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    servicesController.updateService
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    servicesController.deleteService
  );

module.exports = router;
