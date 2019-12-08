const Services = require('./../models/servicesModel');

//Get all Services
exports.getAllServices = async (req, res) => {
  try {
    // Build query
    // 1A) Filtering
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Services.find(JSON.parse(queryStr));
    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('name');
    }
    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // localhost:3000/api/v1/tours/?page=2&limit=5
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numServ = await Services.countDocuments();
      if (skip >= numServ) throw new Error('That page does not exist');
    }

    // execute query
    const services = await query;

    // const services = await Services.find();
    res.status(200).json({
      status: 'success',
      resuts: services.length,
      data: {
        services
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong.'
    });
  }
};
// Get a specific Service
exports.getService = async (req, res) => {
  try {
    const service = await Services.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        service
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
};
// Create a new Service
exports.createService = async (req, res) => {
  try {
    const newService = await Services.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newService
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invaild data sent'
    });
  }
};
// Update a specific service
exports.updateService = async (req, res) => {
  try {
    const service = await Services.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Update successful',
        service
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
};
// Delete a specific service
exports.deleteService = async (req, res) => {
  try {
    await Services.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `Unable to delete service: ${err}`
    });
  }
};
