const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add a description of this service']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Please add a summary of this service']
  },
  price: {
    type: Number,
    default: 30
  },
  priceDiscount: {
    type: Number,
    default: 0.25
  },
  imageCover: {
    type: String,
    required: [true, 'Please add an image']
  },
  images: [String]
});

//Query Middleware
servicesSchema.pre(/^find/, function (next) {
  this.find();
  next();
});

const Services = mongoose.model('Services', servicesSchema);

module.exports = Services;
