const express = require('express');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

router
  .route('/')
  .get(servicesController.getAllServices)
  .post(servicesController.createService);

router
  .route('/:id')
  .get(servicesController.getService)
  .patch(servicesController.updateService)
  .delete(servicesController.deleteService);

module.exports = router;
