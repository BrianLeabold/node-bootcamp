const Services = require('./../models/servicesModel');
//const catchAsync = require('./../utils/catchAsync');
//const ApIFeatures = require('./../utils/apiFeatures');
const factory = require('./handlerFactory');

//Get all Services
exports.getAllServices = factory.getAll(Services);
// Get a specific Service
exports.getService = factory.getOne(Services);
// Create a new Service
exports.createService = factory.createOne(Services);
// Update a specific service
exports.updateService = factory.updateOne(Services);
// Delete a specific service
exports.deleteService = factory.deleteOne(Services);
